const routes = require("express").Router()
const upload = require("../../../middleware/fileUpload")

module.exports = () => {
  routes.get("/", require("./get")()) //all products list
  routes.get("/:id", require("./getProduct")()) // specific product id with query param
  routes.post("/", require("./post")()) // insert new product details
  routes.put("/", upload, require("./put")()) // update product details

  return routes
}
