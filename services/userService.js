const {
  addData,
  getData,
  getDataOnCondition,
  updateData,
  deleteData,
} = require("../services/firebaseService");
const DatabaseError = require("../helpers/DatabaseError");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const COLLECTION_NAME = "users";


async function createUser(data) {
  const { fullName, email, username, userType, id } = data;

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
    throw new DatabaseError("User could not be updated");
  }
}


async function auth(data) {
  let { email } = data;
  let user = null;
  try {
    const result = await getDataOnCondition(
      COLLECTION_NAME,
      "email",
      "==",
      email
    );
    user = result.docs[0];
  } catch (error) {
    console.log(error);
    throw new DatabaseError("Failed to retrieve user");
  }

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
    if (result.exists) return { ...result.data(), id };
    else return null;
  } catch (error) {
    throw new DatabaseError("Failed to retrieve user");
  }
}

async function getUserByEmail(email) {
  try {
    const result = await getDataOnCondition(
      COLLECTION_NAME,
      "email",
      "==",
      email
    );
    const user = result.docs[0];
    if (user == undefined)
      return null;
    else
      return { 
        ...user.data(), id: user.id 
      };
  } catch (error) {
    throw new DatabaseError("Failed to retrieve user");
  }
}


async function addToCart(data, userId) {
  const newCartItem = data;
  try {
    let result = await getData(COLLECTION_NAME, userId);
    const cart = result.data().cart;
    const id = cart.length;
    await updateData(COLLECTION_NAME, userId, {
      cart: [...cart, newCartItem],
    });
    return id;
  } catch (error) {
    throw new DatabaseError("Product could not be added to cart");
  }
}

async function deleteFromCart(data, userId) {
  const { productId } = data;
  try {
    let result = await getData(COLLECTION_NAME, userId);
    const { cart } = result.data();
    const newCart = cart.filter((item) => item.productId != productId);
    await updateData(COLLECTION_NAME, userId, {
      cart: newCart,
    });
  } catch (error) {
    throw new DatabaseError("Product could not be deleted from cart");
  }
}

/* async function updateCart(data, productId, userId) {
  const { quantity } = data;
  try {
    const result = await getData(COLLECTION_NAME, userId);
    const cart = result.data().cart;
    let newCart = null;
    if (quantity)
      newCart = cart.map((item) => {
        if (item.productId == productId) {
          return { ...item, quantity };
        } else {
          return item;
        }
      });
    else
      newCart = cart.map((item) => {
        if (item.productId == productId) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          return item;
        }
      });
    await updateData(COLLECTION_NAME, userId, {
      cart: newCart,
    });
  } catch (error) {
    throw new DatabaseError("product could not be updated from cart");
  }
}
 */
async function updateCart(data, cartItemId, userId) {
  const { quantity } = data;
  try {
    const result = await getData(COLLECTION_NAME, userId);
    const cart = result.data().cart;
    const item = cart[cartItemId];
    if (quantity) {
      cart[cartItemId] = { ...cart[cartItemId], quantity };
    } else {
      cart[cartItemId] = { ...item, quantity: item.quantity + 1 };
    }
    await updateData(COLLECTION_NAME, userId, {
      cart,
    });
  } catch (error) {
    throw new DatabaseError("product could not be updated from cart");
  }
}

async function addCoupon(data) {
  const { sellerId, code, description, discount_rate } = data;
  try {
    const result = await getDataOnCondition(
      "coupons",
      null,
      "code",
      "==",
      code
    );
    let exists = false;
    const coupon = result.docs[0];
    if (coupon && coupon.data().sellerId == sellerId) exists = true;
    if (exists)
      return {
        exists,
        id: coupon.id,
      };
    const id = await addData("coupons", null, {
      sellerId,
      code,
      description,
      discount_rate,
    });
    return {
      exists,
      id,
    };
  } catch (error) {
    throw new DatabaseError("coupon could not be added");
  }
}

async function getCoupon(id) {
  try {
    const result = await getData("coupons", id);
    return result.data();
  } catch (error) {
    throw new DatabaseError(" Failed to retrieve coupon");
  }
}

async function getCouponBySellerId(id) {
  try {
    const result = await getDataOnCondition(
      "coupons",
      null,
      "sellerId",
      "==",
      id
    );
    const docs = result.docs;
    const coupons = [];
    docs
      ? docs.forEach((coupon) => {
          coupons.push(coupon.data());
        })
      : null;
    return coupons;
  } catch (error) {
    console.log(error);
    throw new DatabaseError("Failed to retrieve coupon");
  }
}

async function deleteCoupon(id) {
  try {
    await deleteData("coupons", id);
  } catch (error) {
    throw new DatabaseError("coupon could not be deleted");
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
  getUserById,
  getUserByEmail,
  updateUser,
  addToCart,
  getCart,
  updateCart,
  deleteFromCart,
  addCoupon,
  getCoupon,
  getCouponBySellerId,
  deleteCoupon
};
