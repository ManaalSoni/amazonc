const router = require("express").Router();

const fileUpload = require("../../../middleware/fileUpload");

//get current user
router.get("/", require("./get")) 

//signup {"name":"","username":"", "email": "", "password": "", "mobile": "", "userType": ""}
router.post("/", fileUpload, require("./post")) 

//login {"email": "","password":""}
router.post("/login", require("./login"));

module.exports = router;