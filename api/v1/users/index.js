const router = require("express").Router();
const { check } = require("express-validator");
const userAuth = require("../../../middleware/userAuth");

//get current user
router.get("/", userAuth, require("./get"));

//create user
router.post(
  "/",
  [
    check("fullName", "name is required").notEmpty(),
    check("username", "username is required").notEmpty(),
    check("email", "invalid 'email'").isEmail(),
    check("userType", "userType is required").notEmpty().isArray(),
  ],
  require("./post")
);

//update user
router.put(
  "/",
  userAuth,
  [
    check("email", "Cannot update email").isEmpty(),
    check("cart", "Cannot update cart").not().exists(),
    check("userType", "invalid field 'userType'").optional().isArray().notEmpty(),
  ],
  require("./put")
);

//auth
router.post(
  "/auth",
  [check("email", "invalid 'email'").isEmail()],
  require("./auth")
);

//get user by id
router.get("/id/:id", userAuth, require("./getUserById"));

// get user by email
router.get("/email/:email", userAuth, require("./getUserByEmail"));

//add product to cart
router.post(
  "/cart",
  userAuth,
  [
    check("productId", "productId is required").notEmpty(),
    check("name", "name is required").notEmpty(),
    check("price").isNumeric(),
    check("quantity").isNumeric(),
  ],
  require("./addToCart")
);

// get cart of current user
router.get("/cart", userAuth, require("./getCart"));

// update cart by product id
router.put(
  "/cart/:productId",
  userAuth,
  [
    check("quantity", "invalid field 'quantity'").optional().isNumeric(),
    check("condition", "invalid field 'condition'").optional().isNumeric(),
  ],
  require("./UpdateCart")
);

//delete cart by product id
router.delete("/cart/:productId", userAuth, require("./deleteFromCart"));

module.exports = router;
