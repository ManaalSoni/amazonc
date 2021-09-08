const { validationResult } = require("express-validator");
const DatabaseError = require("../../../helpers/DatabaseError");
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
    if (result)
      return res.status(200).json({
        success: true,
        token: result,
      });
    else
      return res.status(200).json({
        success: false,
        message: "User not found",
      });
  } catch (error) {
    if (error instanceof DatabaseError) {
      return res.status(502).send({
        success: false,
        message: error.message,
      });
    } else {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Server Error",
      });
    }
  }
};
