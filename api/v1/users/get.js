const { validationResult } = require("express-validator");
const DatabaseError = require("../../../helpers/DatabaseError");
require("dotenv").config();
const { getUserById } = require("../../../services/userService");

module.exports = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
    });
  }
  try {
    const user = await getUserById(req.user.id);
    return res.status(200).json({
      succes: true,
      user,
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
