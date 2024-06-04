const express = require("express");
const app = express();
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
const { Op } = require("sequelize");
const {medication,reminder,user} = require("../models");
const cron = require("node-cron");
const { sendEmailNotification } = require('../service/email'); 

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
       // [Op.and]: where(fn('DATE', col('date')), dateWithoutTime),
        // deletedAt: null,
      },
      include: [user] // Include user model to fetch user details
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
        "reminder created for one-time medication",medicationdetail.user.email
      );
      const recipientEmail = medicationdetail.user.email;
      const subject = 'Medication Reminder';
      const text = `Please remember to take your medication ${medicationdetail.name} at ${medicationdetail.time}.`;
      sendEmailNotification(recipientEmail, subject, text);
    });
   // res.json({once})
  }
  else{
    console.log("no medication has been schedule")
  }

   //recurring medications
    const recurringMedications = await medication.findAll({
      where: {
        type: "recurring",
        start_date: { [Op.lte]: todayDate },
        end_date: { [Op.gte]: todayDate },
        day_week: { [Op.like]: `%${todayDay}%` },
      },
    });

// res.json({recurringMedications})
    if(recurringMedications){
   recur= recurringMedications.forEach(async (medicationdetail) => {
      await reminder.create({
        medication_id: medicationdetail.id,
        reminder_at: new Date(`${todayDate} ${medicationdetail.time}`), 
        status: "pending",
      });
      console.log(
        `reminder created for recurring medication: ${medicationdetail.name}`
      );
    });
    const recipientEmail = medicationdetail.user.email;
    const subject = 'Medication Reminder';
    const text = `Please remember to take your recurring medication ${medicationDetail.name} at ${medicationDetail.time}.`;
    await sendEmailNotification(recipientEmail, subject, text);
    // res.json({recur})
  }
  else{
    console.log("no medication has been schedule")
  }
  
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