const express = require("express");
const bodyParser = require("body-parser");
const routeController = require("./api/v1");

require("dotenv").config();

const app = express();

app.use(express.static("./public/uploads"));
app.use(bodyParser.json({ extended: true }));


app.use("/api/v1", routeController);


const port = process.env.PORT;

app.listen(port, function () {
  console.log(`Server started at port ${port}`);
});