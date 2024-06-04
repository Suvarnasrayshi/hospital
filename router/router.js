var express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const {registration,login,logout,logoutalltheuser} = require
('../controller/registration');

const{addMedication}=require('../controller/medication');
const{generateReminders}=require('../controller/reminder')
const{authenticate}=require('../middleware/authenticate')
const { reportgenrator, upload } = require('../controller/report');





router.post("/registration", registration);
router.post("/login", login);
router.post("/logout", logout);
router.post("/logoutalltheuser", logoutalltheuser);
router.post("/addmedication", authenticate, addMedication);
router.post("/reminder",authenticate, generateReminders);
router.post("/report",authenticate,reportgenrator)
// router.post("/report", upload.single('file'),authenticate, reportgenrator);

module.exports = router;
