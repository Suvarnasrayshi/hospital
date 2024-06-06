const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const cron = require('node-cron');
const reportGenerator=require("./controller/report.js")
const dataRoutes = require("./router/router.js")
require('dotenv').config();


app.set("view engine", "ejs");
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(express.json());
const router = express.Router();
router.use(express.json())


app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/", dataRoutes);

app.listen(process.env.PORT || 3001, () => {
  console.log("Running at Port 3001");
});


