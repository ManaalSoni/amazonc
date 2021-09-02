const express = require("express");
const bodyParser = require("body-parser");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("server started");
});
app.use(express.static("./public/uploads"));

const routeController = require("./api/v1")();

app.use(bodyParser.json({ extended: true }));
app.use("/api/v1", routeController);
