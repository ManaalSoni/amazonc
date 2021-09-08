const express = require("express");
const bodyParser = require("body-parser");
const routeController = require("./api/v1");
const cors = require("cors");
require("dotenv").config();

const app = express();


app.use(express.static("./public"));

app.use(bodyParser.json({ extended: true }));

app.use(cors());

app.use("/api/v1", routeController);


// DUMMY DATA CODE
// const { addDataToDB } = require("./dummy/addData");
// const categories = require("./dummy/categories.json");
// app.post("/api/v1/dummy", async(req, res)=>{
//   addDataToDB(categories, "categories");
//   return res.sendStatus(200);
// });


const port = process.env.PORT;

app.listen(port, function () {
  console.log(`Server started at port ${port}`);
});
