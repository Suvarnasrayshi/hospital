const express = require("express");
const app = express();
const Sequelize = require("sequelize");
app.set("view engine", "ejs");
const router = express.Router();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");
const { Op } = require("sequelize");
const {medication,reminder} = require("../models");
const cron = require("node-cron");

// exports.generateReminders = cron.schedule("0 0 * * *", async (req,res) => {
  const generateReminders=async (req,res) => {
  // const todayDate = new Date();
  // todayDate.setHours(0, 0, 0, 0);
  const todayDate = new Date();
  const dateWithoutTime = todayDate.toISOString().split('T')[0];
console.log(dateWithoutTime);
   const todayDay = todayDate.toLocaleString("en-US", { weekday: "long" });
    console.log("todayDay-"+todayDay);
  try {
    const oneTimeMedications = await medication.findAll({
      where: {
        type: "one-time",
       //date:dateWithoutTime,
      },
    });
    // res.json({oneTimeMedications})

    if(oneTimeMedications){
    once=oneTimeMedications.forEach(async (medicationdetail) => {
      await reminder.create({
        medication_id: medicationdetail.id,
        reminder_at: new Date(`${medicationdetail.date} ${medicationdetail.time}`), 
        status: "pending",
      });
      console.log(
        "reminder created for one-time medication"
      );
    });
   // res.json({once})
  }
  else{
    console.log("no medication has been schedule")
  }

    // Handle recurring medications
    // const recurringMedications = await medication.findAll({
    //   where: {
    //     type: "recurring",
    //     start_date: { [Op.lte]: todayDate },
    //     end_date: { [Op.gte]: todayDate },
    //     day_week: { [Op.like]: `%${todayDay}%` },
    //   },
    // });

// res.json({recurringMedications})
  //   if(recurringMedications){
  //  recur= recurringMedications.forEach(async (medicationdetail) => {
  //     await reminder.create({
  //       medication_id: medicationdetail.id,
  //       reminder_at: new Date(`${todayDate} ${medicationdetail.time}`), 
  //       status: "pending",
  //     });
  //     console.log(
  //       `reminder created for recurring medication: ${medicationdetail.name}`
  //     );
  //   });
  //   res.json({recur})
  // }
  // else{
  //   console.log("no medication has been schedule")
  // }
  
} catch (error) {
  console.error("Error generating reminders:", error);
}
};
// cron.schedule('*/10 * * * *', generateReminders);
cron.schedule("0 0 * * * *", function() { 
  console.log("schedule the cron to run daily at midnight"); 
  generateReminders();
}); 
// console.log("Cron job for generating reminders is set up.");

module.exports = { generateReminders };