const {
  firebase,
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

  let user = {
    fullName,
    email,
    username,
    cart: [],
    userType,
  };

  try {
    await addData(COLLECTION_NAME, id, user);
    return {
      user: {
        ...user,
      },
    };
  } catch (error) {
    throw new DatabaseError("User could not be created");
  }
}

async function updateUser(data, userId) {
  const { fullName, userType } = data;
  try {
    await updateData(COLLECTION_NAME, userId, {
      fullName,
      userType,
    });
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
  return token;
}


async function getUserById(id) {
  try {
    const result = await getData(COLLECTION_NAME, id);
    return { ...result.data(), id };
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
    return { ...result.docs[0].data(), id: result.docs[0].id };
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
}

module.exports = {
  createUser,
  auth,
  getUserById,
  getUserByEmail,
  addToCart,
  deleteFromCart,
  updateCart,
  updateUser,
  addCoupon,
  getCoupon,
  deleteCoupon,
  getCouponBySellerId,
};
