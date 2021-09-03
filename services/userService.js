const { firebase, addData } = require("../services/firebaseService");

const COLLECTION_NAME = "users";

async function createUser(data) {

  const { fullName, email, username, password, userType } = data;

  const userCredentials = await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password);

  let user = {
    fullName,
    email,
    username,
    cart: [],
    userType,
  };

  const token = await userCredentials.user.getIdToken();
  await addData(COLLECTION_NAME, userCredentials.user.uid, user);

  return { 
    user:{
      id: userCredentials.user.uid,
      ...user
    }, 
    accessToken: token }
}

module.exports = {
  createUser,
}
