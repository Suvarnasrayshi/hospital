const express = require("express");
const app = express();
const cron = require('node-cron');
const fs = require('fs');
const { Op } = require('sequelize');
const { medication,report } = require('../models');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

exports.reportgenrator =async(req,res)=>{
  const filepath = '/home/suvarna-sinha/Documents/hospitalcsvvvvvvvvvv/'+ Date.now()+'.csv';
  const today= new Date();
var first = today.getDate() - today.getDay(); 
var last = first + 6; 

var startOfWeek = new Date(today.setDate(first)).toUTCString();
var endOfWeek = new Date(today.setDate(last)).toUTCString();

  const medicationdetail = await medication.findAll({
    where: {
      date: { [Op.between]: [startOfWeek, endOfWeek] }
    }
  });

  if(medicationdetail){
    let csvContent = 'Medicine Name,Date,Time\n';
    medicationdetail.forEach((element) => {
    csvContent +=  `${element.name},${element.date},${element.time}\n`;
  })

  fs.writeFile(filepath, csvContent, (err) => {
    if (err) console.log(err);
    else console.log("Data saved");
    console.log(filepath);
  });
  }
}

cron.schedule('0 0 * * 0', () => {
  console.log('making weekly report generation...');
  generateReport();
});