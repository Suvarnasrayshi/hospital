const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const cron = require('node-cron');
const reportGenerator=require("./controller/report.js")
const dataRoutes = require("./router/router.js")


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", dataRoutes);

app.listen(process.env.PORT || 3023, () => {
  console.log("Running at Port 3023");
});


