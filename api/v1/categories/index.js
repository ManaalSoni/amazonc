const router = require("express").Router();
const userAuth = require("../../../middleware/userAuth");

//Get all categories
router.get("/", userAuth, require("./get"));

//Get category by id
router.get("/:id", userAuth, require("./getById"));

module.exports = router;