const { firebase, addData } = require("../services/firebaseService")

async function createUser(data) {
  const { name, email, username, password, address, phoneNumber, userType } =
    data
  const userCredentials = await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
  let user = {
    name,
    email,
    username,
    address,
    phoneNumber,
    cart: [],
    userType,
  }
  const token = await userCredentials.user.getIdToken()
  await addData("users", userCredentials.user.uid, user)
  return { user, accessToken: token }
}

module.exports = {
  createUser,
}
