const {
  firebase,
  addData,
  getData,
  getDataOnCondition,
  updateData,
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
    throw new DatabaseError("user could not be updated");
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
    throw new DatabaseError("user could not be updated");
  }
}

async function auth(data) {
  const { email, id } = data;

  const userToken = {
    email,
    id,
  };

  const token = jwt.sign(userToken, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "6h",
  });
  return token;
}

async function getUserById(id) {
  try {
    const result = await getData(COLLECTION_NAME, id);
    return result?.data();
  } catch (error) {
    throw new DatabaseError("Fail to retrieve user");
  }
}

async function getUserByEmail(email) {
  try {
    const result = await getDataOnCondition(
      COLLECTION_NAME,
      null,
      "email",
      "==",
      email
    );
    return result?.docs[0].data();
  } catch (error) {
    throw new DatabaseError("Fail to retrieve user");
  }
}

module.exports = {
  createUser,
  auth,
  updateUser,
  getUserById,
  getUserByEmail,
};
