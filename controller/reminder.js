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
















// at Packet.asError (/home/suvarna-sinha/Documents/hospital_healthandwellness/hospital/node_modules/mysql2/lib/packets/packet.js:728:17)
// at Execute.execute (/home/suvarna-sinha/Documents/hospital_healthandwellness/hospital/node_modules/mysql2/lib/commands/command.js:29:26)
// at Connection.handlePacket (/home/suvarna-sinha/Documents/hospital_healthandwellness/hospital/node_modules/mysql2/lib/connection.js:481:34)
// at PacketParser.onPacket (/home/suvarna-sinha/Documents/hospital_healthandwellness/hospital/node_modules/mysql2/lib/connection.js:97:12)
// at PacketParser.executeStart (/home/suvarna-sinha/Documents/hospital_healthandwellness/hospital/node_modules/mysql2/lib/packet_parser.js:75:16)
// at Socket.<anonymous> (/home/suvarna-sinha/Documents/hospital_healthandwellness/hospital/node_modules/mysql2/lib/connection.js:104:25)
// at Socket.emit (node:events:513:28)
// at addChunk (node:internal/streams/readable:315:12)
// at readableAddChunk (node:internal/streams/readable:289:9)
// at Socket.Readable.push (node:internal/streams/readable:228:10) {
// code: 'ER_TRUNCATED_WRONG_VALUE',
// errno: 1292,
// sqlState: '22007',
// sqlMessage: "Incorrect datetime value: 'Invalid date' for column 'reminder_at' at row 1",
// sql: 'INSERT INTO `reminders` (`id`,`medication_id`,`reminder_at`,`status`,`createdAt`,`updatedAt`) VALUES (DEFAULT,?,?,?,?,?);',
// parameters: [
// 10,
// 'Invalid date',
// 'pending',
// '2024-06-04 12:30:00',
// '2024-06-04 12:30:00'
// ]
// },
// sql: 'INSERT INTO `reminders` (`id`,`medication_id`,`reminder_at`,`status`,`createdAt`,`updatedAt`) VALUES (DEFAULT,?,?,?,?,?);',
// parameters: [
// 10,
// 'Invalid date',
// 'pending',
// '2024-06-04 12:30:00',
// '2024-06-04 12:30:00'
// ]
// }
// [nodemon] app crashed - waiting for file changes before starting...