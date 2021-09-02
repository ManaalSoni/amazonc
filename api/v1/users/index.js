const routes = require("express").Router()

module.exports = () => {
  routes.get("/", require("./get")()) //get current user
  routes.post("/", require("./post")()) //signup {"name":"","username":"", "email": "", "password": "", "mobile": "", "userType": ""}
  routes.post("/login", require("./login")()) //login {"email": "","password":""}

  return routes
}
