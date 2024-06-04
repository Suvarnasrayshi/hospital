var express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const {registration,login,logout,logoutalltheuser,getregister,getlogin} = require
('../controller/registration');

const{addMedication,addmedicationonce,addmedicationrecuring}=require('../controller/medication');
const{generateReminders}=require('../controller/reminder')
const{authenticate}=require('../middleware/authenticate')
const { reportgenrator, upload } = require('../controller/report');

// router.route("/password").get(getpassword).post(postpassword);


router.get("/",getregister);
router.post("/registration", registration);
router.get("/login", getlogin);
router.post("/login", login);
router.post("/logout", logout);
router.post("/logoutalltheuser", logoutalltheuser);
router.post("/addmedication", authenticate, addMedication);
router.get("/addmedication", authenticate, addMedication);
router.get("/addmedicationonce", authenticate, addmedicationonce);
router.get("/addmedicationrecuring", authenticate, addmedicationrecuring);
router.post("/reminder",authenticate, generateReminders);
router.post("/report",authenticate,reportgenrator)
// router.post("/report", upload.single('file'),authenticate, reportgenrator);

module.exports = router;
