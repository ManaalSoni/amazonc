const {
  addData,
  getData,
  getDataOnCondition,
  updateData,
} = require("../services/firebaseService");
const DatabaseError = require("../helpers/DatabaseError");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const COLLECTION_NAME = "users";

async function createUser(user) {
  const { fullName, email, username, userType, id } = user;

  let userObject = {
    fullName,
    email,
    username,
    cart: [],
    userType,
  };

  try {
    const result = await getUserById(id);
    if (result.exists) return { exists: true };
    await addData(COLLECTION_NAME, id, userObject);
  } catch (error) {
    throw new DatabaseError("user could not be created");
  }
  return {
    exists: false,
    user: userObject,
  };
}

async function updateUser(data, userId) {
  try {
    await updateData(COLLECTION_NAME, userId, data);
  } catch (error) {
    throw new DatabaseError("user could not be updated");
  }
}

async function auth(email) {
  let result = null;
  try {
    result = await getDataOnCondition(COLLECTION_NAME, "email", "==", email);
  } catch (error) {
    throw new DatabaseError("Fail to retrieve user");
  }
  const user = result.docs[0];
  if (user == undefined) return { exists: false };
  const userToken = {
    email: user.data().email,
    id: user.id,
  };

  const token = jwt.sign(userToken, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "6h",
  });
  return { exists: true, token };
}

async function getUserById(id) {
  try {
    const result = await getData(COLLECTION_NAME, id);
    if (result.exists) return { exists: true, user: { ...result.data(), id } };
    else return { exists: false };
  } catch (error) {
    throw new DatabaseError("Fail to retrieve user");
  }
}

async function getUserByEmail(email) {
  let result = null;
  try {
    result = await getDataOnCondition(COLLECTION_NAME, "email", "==", email);
  } catch (error) {
    throw new DatabaseError("Fail to retrieve user");
  }
  const user = result.docs[0];
  if (user == undefined)
    return {
      exists: false,
    };
  else
    return {
      exists: true,
      user: { ...user.data(), id: user.id },
    };
}

async function addToCart(newCartItem, userId) {
  newCartItem.price = Number(newCartItem.price);
  newCartItem.quantity = Number(newCartItem.quantity);

  let result = null;
  try {
    result = await getData(COLLECTION_NAME, userId);
  } catch (error) {
    throw new DatabaseError("Product could not be added to cart");
  }
  const cart = result.data().cart;
  let exists = false;
  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    if (item.productId == newCartItem.productId) {
      cart[i] = { ...item, quantity: item.quantity + 1 };
      exists = true;
      break;
    }
  }
  if (!exists) cart.push(newCartItem);
  try {
    await updateData(COLLECTION_NAME, userId, {
      cart,
    });
  } catch (error) {
    throw new DatabaseError("Product could not be added to cart");
  }
}

async function getCart(id) {
  let result = null;
  try {
    result = await getUserById(id);
  } catch (error) {
    if (error instanceof DatabaseError)
      throw new DatabaseError("Failed to retrieve cart");
    throw error;
  }
  return result.user.cart;
}

async function deleteFromCart(productId, userId) {
  let result = null;
  try {
    result = await getData(COLLECTION_NAME, userId);
  } catch (error) {
    throw new DatabaseError("Product could not be deleted from cart");
  }
  let exists = false;
  const { cart } = result.data();

  const newCart = cart.filter((item) => {
    if (item.productId == productId) {
      exists = true;
      return false;
    } else {
      return true;
    }
  });
  try {
    await updateData(COLLECTION_NAME, userId, {
      cart: newCart,
    });
    return exists;
  } catch (error) {
    throw new DatabaseError("Product could not be deleted from cart");
  }
}

async function updateCart(data, productId, userId) {
  let result = null;
  let newCart = [];
  try {
    result = await getData(COLLECTION_NAME, userId);
  } catch (error) {
    throw new DatabaseError("Product could not be updated into cart");
  }
  const cart = result.data().cart;
  let exists = false;
  if (data.quantity != undefined) {
    for (let i = 0; i < cart.length; i++) {
      const item = cart[i];
      if (item.productId == productId) {
        cart[i] = { ...item, quantity: Number(data.quantity) };
        exists = true;
        break;
      }
    }
    newCart = cart;
  } else {
    for (let i = 0; i < cart.length; i++) {
      const item = cart[i];
      if (item.productId == productId) {
        exists = true;
        const condition = Number(data.condition) < 0 ? 0 : 1;
        if (condition) {
          newCart.push({ ...item, quantity: item.quantity + 1 });
        } else {
          if (item.quantity > 1) {
            newCart.push({ ...item, quantity: item.quantity - 1 });
          }
        }
      } else {
        newCart.push(item);
      }
    }
  }
  try {
    await updateData(COLLECTION_NAME, userId, {
      cart: newCart,
    });
  } catch (error) {
    throw new DatabaseError("product could not be updated into cart");
  }
  return exists;
}

module.exports = {
  createUser,
  auth,
  updateUser,
  getUserById,
  getUserByEmail,
  addToCart,
  getCart,
  deleteFromCart,
  updateCart,
};
