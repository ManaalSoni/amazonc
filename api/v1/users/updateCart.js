const { validationResult } = require("express-validator");
const { updateCart } = require("../../../services/userService");
const DatabaseError = require("../../../helpers/DatabaseError");

module.exports = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
    });
  }
  try {
    const exists = await updateCart(
      req.body,
      req.params.productId,
      req.user.id
    );
    if (exists)
      return res.status(200).send({
        success: true,
        message: "cart updated",
      });
    else
      return res.status(200).send({
        success: false,
        message: "product not found in cart",
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
