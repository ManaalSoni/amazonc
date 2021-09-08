const { addCoupon } = require("../../../services/couponService");
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
    const result = await addCoupon(req.body, req.user.id);
    if (result.exists) {
      res.status(200).send({
        success: false,
        message: "coupon already exists",
        id: result.id,
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "coupon added",
        id: result.id,
      });
    }
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
