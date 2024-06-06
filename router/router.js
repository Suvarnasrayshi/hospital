var express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();

const {registration,login,logout,logoutalltheuser,getregister,getlogin,dashboard,logoutothersevice} = require('../controller/registration');
const{addMedication,addmedicationonce,addmedicationrecuring}=require('../controller/medication');
const{generateReminders}=require('../controller/reminder')
const{authenticate}=require('../middleware/authenticate')
const { reportgenrator, upload } = require('../controller/report');

router.get("/",getregister);
router.post("/registration", registration);
router.get("/login", getlogin);
router.get("/dashboard",dashboard);
router.post("/login", login);
router.post("/logout",authenticate, logout);
router.post("/logoutalltheuser",authenticate,logoutalltheuser);
router.post("/logoutothersevice",authenticate,logoutothersevice);
router.post("/addmedication", authenticate, addMedication);
router.get("/addmedication", authenticate, addMedication);
router.get("/addmedicationonce", addmedicationonce);
router.get("/addmedicationrecuring", authenticate, addmedicationrecuring);
router.post("/reminder",authenticate, generateReminders);
router.post("/report",authenticate,reportgenrator)
// router.post("/report", upload.single('file'),authenticate, reportgenrator);

module.exports = router;
