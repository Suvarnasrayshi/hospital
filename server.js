const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const sequelize = require("./utils/database.js");
const bodyParser = require("body-parser");
const cron = require('node-cron');
const reportGenerator=require("./controller/report.js")
const dataRoutes = require("./router/router.js")


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", dataRoutes);
// cron.schedule('0 0 * * 0', () => {
// cron.schedule('* * * * *', () => {

//   reportGenerator();
//   console.log('Running weekly report generation...');
// });
sequelize.sync({ force: false });
app.listen(process.env.PORT || 3023, () => {
  console.log("Running at Port 3023");
});


