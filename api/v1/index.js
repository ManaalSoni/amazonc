const routes = require("express").Router()

module.exports = () => {
  routes.use("/users", require("./users")())
  routes.use("/products", require("./products")())
  return routes
}
