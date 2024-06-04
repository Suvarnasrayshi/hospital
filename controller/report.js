const express = require("express");
const app = express();
const cron = require('node-cron');
const fs = require('fs');
const { Op } = require('sequelize');
const { medication,report,user } = require('../models');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const multer = require("multer")
const {sendEmailNotification} = require("../service/email")

const reportstorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/home/suvarna-sinha/Documents/hospitalcsvvvvvvvvvv/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: reportstorage });



const reportgenrator = async (req, res) => {
  const filepath = '/home/suvarna-sinha/Documents/hospitalcsvvvvvvvvvv/'+ Date.now()+'.csv';
  const today= new Date();
let first = today.getDate() - today.getDay(); 
let last = first + 6; 
const user_id = req.user.id;
console.log(user_id);
let startOfWeek = new Date(today.setDate(first)).toUTCString();
let endOfWeek = new Date(today.setDate(last)).toUTCString();

  const medicationdetail = await medication.findAll({
    attributes:['name','description','time','date','user.email'],
    raw:true,
    where: {
      date: { [Op.between]: [startOfWeek, endOfWeek] }
    },
    include: [user,
    ] 
  });

console.log("medicationdetail",medicationdetail)

  if(medicationdetail){
    let csvContent = 'Medicine Name,Medicine Date,Medicine Time\n';
    // res.json({medicationdetail});
    medicationdetail.forEach((element) => {
    csvContent +=  `${element.name},${element.date},${element.time}\n`;
  })

  const descriptions=medicationdetail[0].description;
  fs.writeFile(filepath, csvContent, async(err) => {
    if (err) console.log(err);
    else 
    try {
      const register=await report.create({
       user_id,
       report_date:new Date(),
       description:descriptions
      });
      
     } catch (error) {
       res.json({ error });
     }
    console.log("Data saved !!!");
    console.log(filepath);
  });
  }

  console.log("helohellohellohellohello",medicationdetail[0].email)
  console.log("object",medicationdetail[0].name);
  // res.json({medicationdetail})

  const recipientEmail = medicationdetail[0].email;
  const subject = 'Weekly Report';
  const text = 'Here is your weekly report.';
  const attachment = filepath; 
  sendEmailNotification(recipientEmail, subject, text, attachment);
}

cron.schedule('0 0 * * 0', () => {
// cron.schedule('* * * * *', () => {
  console.log('making weekly report generation...');
  reportgenrator();
});


module.exports = { upload,reportgenrator }