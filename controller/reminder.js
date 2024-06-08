const express = require("express");
const app = express();
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
const { Op } = require("sequelize");
const { medication, reminder, user } = require("../models");
const cron = require("node-cron");

const { EmailQueue } =require('../service/producer')

const generateReminders = async () => {
  const todayDate = new Date();
  const dateWithoutTime = todayDate.toISOString().split("T")[0];
  console.log(dateWithoutTime);
  const todayDay = todayDate.toLocaleString("en-US", { weekday: "long" });
  const currentTime = new Date();
  console.log("dateWithoutTime",dateWithoutTime);

  let hours = currentTime.getHours().toString().padStart(2, '0');
  let minutes = currentTime.getMinutes().toString().padStart(2, '0');
  let seconds = currentTime.getSeconds().toString().padStart(2, '0');
  console.log("seconds"+seconds);
  console.log("todayDay-" + todayDay);
  console.log(hours + ":" + minutes + ":" + seconds);
  let totaltime = hours + ":" + minutes + ":" + seconds
  try {
    
    const allMedications = await medication.findAll({
      attributes: ['name', 'description', 'time', 'date','start_date','end_date','type','rec_type','day_week', 'user.email', 'user.id'],
      raw:true,
      include: [user],
    });

     console.log("allMedications",allMedications);

    if (allMedications) {
      allMedications.forEach(async (medicationdetail) => {
     
         if (medicationdetail.type === "one-time" && 
        medicationdetail.date === dateWithoutTime &&
        medicationdetail.time === totaltime
        ) {
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
        console.log(medicationdetail.start_date);
        console.log(medicationdetail.end_date);
        if (medicationdetail.type === "recurring" &&
            medicationdetail.start_date <= dateWithoutTime &&
            medicationdetail.end_date >= dateWithoutTime 
             && medicationdetail.time === totaltime) {
              
              console.log("hello world!!!");
             if(  medicationdetail.rec_type=== "daily"){
          await reminder.create({
            medication_id: medicationdetail.id,
            reminder_at: new Date(`${dateWithoutTime} ${medicationdetail.time}`),
            status: "pending",
          });
          console.log("daily");
        }
         if (medicationdetail.rec_type=== "weekly" ) {
          console.log(" in side the above the week");
          if (medicationdetail.day_week === todayDay ) {
            
          
            await reminder.create({
              medication_id: medicationdetail.id,
              reminder_at: new Date(`${dateWithoutTime} ${medicationdetail.time}`),
              status: "pending",
            });
            console.log("weekly");
          }
          }
         
          console.log(`Reminder created for recurring medication: ${medicationdetail.email}`);
          
          EmailQueue.add("email",{
             recipientEmail:medicationdetail.email,
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


