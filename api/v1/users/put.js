const { updateUser } = require("../../../services/userService");
const DatabaseError = require("../../../helpers/DatabaseError");
const { validationResult } = require("express-validator");

module.exports = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
    });
  }
  try {
    await updateUser(req.body, req.user.id);
    return res.status(200).send({
      success: true,
      message: "user account updated",
    });
  } catch (error) {
    console.log(error);
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
