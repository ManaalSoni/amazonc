/* const { validationResult } = require("express-validator");
const DatabaseError = require("../../../helpers/DatabaseError");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { auth } = require("../../../services/userService");

module.exports = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
    });
  }
  try {
    const result = await auth(req.body);
    if (result.exists == false) {
      return res.status(200).send({
        success: true,
        message: "loggedIn failed",
      });
    }
    const userToken = {
      email: result.email,
      id: result.id,
    };
    const token = jwt.sign(userToken, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "10m",
    });
    return res.status(200).json({
      success: true,
      message: "user loggedIn",
      token,
    });
  } catch (error) {
    if (error instanceof DatabaseError) {
      return res.status(502).send({
        success: false,
        message: error.message,
      });
    } else {
      return res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  }
};
 */

const { validationResult } = require("express-validator");
const DatabaseError = require("../../../helpers/DatabaseError");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { auth } = require("../../../services/userService");

module.exports = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
    });
  }
  try {
    const token = await auth(req.body);
    return res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    if (error instanceof DatabaseError) {
      return res.status(502).send({
        success: false,
        message: error.message,
      });
    } else {
      return res.status(500).send({
        success: false,
        message: "Server Error",
      });
    }
  }
};
