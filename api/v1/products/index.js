const router = require("express").Router()
const upload = require("../../../middleware/fileUpload")

router.get("/", require("./get")) //all products list

router.get("/:id", require("./getProduct")) // specific product id with query param

router.post("/", require("./post")) // insert new product details

router.put("/", upload, require("./put")) // update product details

module.exports = router;