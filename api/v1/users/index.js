const router = require("express").Router();

//get current user
router.get("/", require("./get")) 

//signup {"name":"","username":"", "email": "", "password": "", "mobile": "", "userType": ""}
router.post("/", require("./post")) 

//login {"email": "","password":""}
router.post("/login", require("./login"));

module.exports = router;