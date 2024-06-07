const express = require("express");
const app = express();
const cron = require('node-cron');
const fs = require('fs');
const { Op } = require('sequelize');
const { medication,report,user } = require('../models');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const {sendEmailNotification} = require("../service/email")


const reportgenrator = async () => {
  const filepath = '/home/suvarna-sinha/Documents/hospitalcsvvvvvvvvvv/'+ Date.now()+'.csv';
  const today= new Date();
let first = today.getDate() - today.getDay(); 
let last = first + 6; 
let startOfWeek = new Date(today.setDate(first)).toISOString().split('T')[0];
let endOfWeek = new Date(today.setDate(last)).toISOString().split('T')[0];
  // const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())).toISOString().split('T')[0];
  // const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6)).toISOString().split('T')[0];
  try {
    const medicationDetails = await medication.findAll({
      attributes: ['name', 'description', 'time', 'date', 'user.email', 'user.id'],
      raw: true,
      where: {
        date: { [Op.between]: [startOfWeek, endOfWeek] }
      },
      include: [user]
    });

    if (medicationDetails.length > 0) {
      let csvContent = 'Medicine Name,Medicine Date,Medicine Time\n';
      medicationDetails.forEach(element => {
        csvContent += `${element.name},${element.date},${element.time}\n`;
      });

      const descriptions = medicationDetails[0].description;
      fs.writeFile(filepath, csvContent, async (err) => {
        if (err) {
          console.log(err);
        } else {
          try {
            await report.create({
              user_id: medicationDetails[0].id,
              report_date: new Date(),
              description: descriptions
            });
            console.log("Data saved !!!");
            console.log(filepath);

            const recipientEmail = medicationDetails[0].email;
            const subject = 'Weekly Report';
            const text = `Here is your weekly report for the ${medicationDetails[0].description}`;
            sendEmailNotification(recipientEmail, subject, text, filepath);
          } catch (error) {
            console.log(error);
          }
        }
      });
    } else {
      console.log("No medication details found for the week.");
    }
  } catch (error) {
    console.error("Error generating report:", error);
  }
};

// Schedule the cron job to run weekly
cron.schedule('* * * * */6', () => {
  console.log('Generating weekly report...');
  reportgenrator();
});

module.exports = { reportgenrator };