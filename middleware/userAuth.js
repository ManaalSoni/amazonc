const jwt = require("jsonwebtoken");
const { getUserById } = require("../services/userService");
require("dotenv").config();

function userAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.sendStatus(401);
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
      const userObject = user ? await getUserById(user.id) : null;
      if (err || userObject == null) {
        return res.sendStatus(403);
      } else {
        req.user = user;
        next();
      }
    });
  }
}

module.exports = userAuth;
