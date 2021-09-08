const router = require("express").Router();
const { check } = require("express-validator");
const userAuth = require("../../../middleware/userAuth");
const typeCheck = require("../../../middleware/typeCheck");

//add coupon
router.post(
  "/",
  check("code", "code is required").notEmpty(),
  check("description", "name is required").notEmpty(),
  check("discount_rate", "invalid field 'price'").isNumeric(),
  userAuth,
  typeCheck,
  require("./post")
);

//get current seller coupon
router.get("/", userAuth, require("./get"));

//get coupon by id
router.get("/:couponId", userAuth, require("./getCouponById"));

//get coupon by seller id
router.get("/seller/:sellerId", userAuth, require("./getCouponBySellerId"));

//delete coupon by id
router.delete("/:couponId", userAuth, require("./delete"));

module.exports = router;
