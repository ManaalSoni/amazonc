const router = require("express").Router();
const userAuth = require("../../../middleware/userAuth");

//add product review
router.post("/:id", userAuth, require("./post"));

//read reviews
router.get("/:id", userAuth, require("./get"));

//delete reviews
router.delete("/:id", userAuth, require("./delete"));

module.exports = router;