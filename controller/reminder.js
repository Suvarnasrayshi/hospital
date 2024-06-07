const express = require("express");
const app = express();
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
const { Op } = require("sequelize");
const { medication, reminder, user } = require("../models");
const cron = require("node-cron");
const { sendEmailreminderNotification } = require("../service/reminderemail");
const { EmailQueue } =require('../service/producer')

const generateReminders = async () => {
  const todayDate = new Date();
  const dateWithoutTime = todayDate.toISOString().split("T")[0];
  console.log(dateWithoutTime);
  const todayDay = todayDate.toLocaleString("en-US", { weekday: "long" });
  const currentTime = new Date();
  console.log("dateWithoutTime",dateWithoutTime);

  let hours = currentTime.getHours();
  let minutes = currentTime.getMinutes();
  let seconds = '00';
  console.log("seconds"+seconds);
  console.log("todayDay-" + todayDay);
  console.log(hours + ":" + minutes + ":" + seconds);
  let totaltime = hours + ":" + minutes + ":" + seconds
  // console.log("eddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd"+totaltime);
  try {
    
    const allMedications = await medication.findAll({
      include: [user],
    });

    
    if (allMedications) {
      allMedications.forEach(async (medicationdetail) => {
        console.log(medicationdetail.date);
        console.log("object",dateWithoutTime);
        console.log("timedata",medicationdetail.time);
        console.log("time",totaltime);
         if (medicationdetail.type === "one-time" && 
        medicationdetail.date === dateWithoutTime &&
        medicationdetail.time === totaltime
        ) {
          console.log("fgnflllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll");
          await reminder.create({
            medication_id: medicationdetail.id,
            reminder_at: new Date(`${medicationdetail.date} ${medicationdetail.time}`),
            status: "pending",
          });
          console.log("Reminder created for one-time medication", medicationdetail.user.email);
          EmailQueue.add("email",{
            recipientEmail:medicationdetail.user.email,
            subject:'Medication Reminder',
            text:`Please remember to take your medication ${medicationdetail.name} at ${medicationdetail.time}.`,
           medicationId: medicationdetail.id
         });

        }

        if (medicationdetail.type === "recurring" &&
            medicationdetail.start_date <= todayDate &&
            medicationdetail.end_date >= todayDate &&
            medicationdetail.day_week === todayDay &&
            medicationdetail.time === totaltime) {
          await reminder.create({
            medication_id: medicationdetail.id,
            reminder_at: new Date(`${dateWithoutTime} ${medicationdetail.time}`),
            status: "pending",
          });
          console.log(`Reminder created for recurring medication: ${medicationdetail.name}`);
          
          EmailQueue.add("email",{
             recipientEmail:medicationdetail.user.email,
             subject:'Medication Reminder',
             text:`Please remember to take your medication ${medicationdetail.name} at ${medicationdetail.time}.`,
            medicationId: medicationdetail.id
          });
          
        }
      });
    } else {
      console.log("No medication found");
    }
  } catch (error) {
    console.error("Error generating reminders:", error);
  }
};

  cron.schedule("* * * * *", function() {
  console.log("Scheduled the cron to run daily at midnight");
  generateReminders();
});

module.exports = { generateReminders };
