const router = require("express").Router();
const { check } = require("express-validator");
const fileUpload = require("../../../middleware/fileUpload");
const userAuth = require("../../../middleware/userAuth");

//get current user
router.get("/", userAuth, require("./get"));

//signup {"fullName":"","username":"", "email": "", "password": "", "userType": ""}
router.post(
  "/",
  [
    check("fullName", "name is required").notEmpty(),
    check("username", "username is required").notEmpty(),
    check("email", "invalid 'email'").isEmail(),
    check("userType", "userType is required").notEmpty(),
  ],
  require("./post")
);

//update user
router.put(
  "/",
  userAuth,
  [
    check("fullName", "name is required").notEmpty(),
    check("userType", "userType is required").notEmpty(),
  ],
  require("./put")
);

//login {"email": "","password":""}
router.post(
  "/auth",
  [check("email", "invalid 'email'").isEmail()],
  require("./auth")
);

router.get("/id/:id", userAuth, require("./getUserById"));

router.get("/email/:email", userAuth, require("./getUserByEmail"));

module.exports = router;
