const jwt = require("jsonwebtoken");
const { getUserById } = require("../services/userService");
require("dotenv").config();

function userAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.sendStatus(401);
  } else {

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      const user = decoded ? await getUserById(decoded.id) : null;
      if (err || user == null) {
        return res.sendStatus(403);
      } else {
        req.user = {
          id: user.id,
          email: user.email
        };
        next();
      }
    });
  }
}

module.exports = userAuth;
