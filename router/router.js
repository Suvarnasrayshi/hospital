const express = require('express');
const router = express.Router();
const { registration, login, logout, logoutalltheuser, getregister, getlogin, dashboard, logoutothersevice,forgetpassword,getforgetpassword} = require('../controller/registration');
const { addMedication, addmedicationonce, addmedicationrecuring,marksasdone } = require('../controller/medication');
const { generateReminders } = require('../controller/reminder');
const { authenticate } = require('../middleware/authenticate');
const { reportgenrator, upload } = require('../controller/report');

router.get("/", getregister);
router.post("/registration", registration);
router.get("/login", getlogin);
router.get("/dashboard", authenticate, dashboard);
router.post("/login", login);
router.post("/forgetpassword",forgetpassword),
router.get("/getforgetpassword",getforgetpassword)
router.post("/logout", authenticate, logout);
router.post("/logoutalltheuser", authenticate, logoutalltheuser);
router.post("/logoutothersevice", authenticate, logoutothersevice);
router.post("/addmedication", authenticate, addMedication);
router.get("/addmedicationonce", authenticate, addmedicationonce);
router.get("/addmedicationrecuring", authenticate, addmedicationrecuring);
router.post("/reminder", authenticate, generateReminders);
router.post("/report", authenticate, reportgenrator);
router.get('/markasdone/:medication_id',marksasdone)

module.exports = router;

// router.post("/report", upload.single('file'), authenticate, reportgenrator);