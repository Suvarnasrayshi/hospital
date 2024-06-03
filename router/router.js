var express = require("express");
const bodyParser = require("body-parser");
const dataresult = express.Router();

const {registration,login,logout,logoutalltheuser} = require
('../controller/registration');

const{addMedication}=require('../controller/medication');
const{generateReminders}=require('../controller/reminder')
const{authenticate}=require('../middleware/authenticate')
const {reportgenrator}=require('../controller/report')

 dataresult.route("/").post(registration);
  dataresult.route("/login").post(login);
  dataresult.route("/logout").post(logout);
  dataresult.route("/logoutalltheuser").post(logoutalltheuser);
  dataresult.route("/addmedication").post(authenticate,addMedication);
  dataresult.route("/reminder").post(generateReminders);
  dataresult.route("/report").post(reportgenrator);

module.exports = dataresult;
