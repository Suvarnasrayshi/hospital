const express = require("express");
const app = express();
const cron = require('node-cron');
const fs = require('fs');
const { Op } = require('sequelize');
const { medication,report,user } = require('../models');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const sequelize = require("../utils/database");
const Sequelize = require("sequelize");
app.set("view engine", "ejs");
const router = express.Router();
const jwt = require('jsonwebtoken');


exports.reportgenrator =async(req,res)=>{
  const filepath = '/home/suvarna-sinha/Documents/hospitalcsvvvvvvvvvv/'+ Date.now()+'.csv';
  const today= new Date();
let first = today.getDate() - today.getDay(); 
let last = first + 6; 
const user_id = req.user.id; 

let startOfWeek = new Date(today.setDate(first)).toUTCString();
let endOfWeek = new Date(today.setDate(last)).toUTCString();

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
    else 
    try {
      const register= report.create({
       user_id,
       report_date:new Date(),
       description:medication.name,
      });
       res.json({ message: 'report data inserted successfully' });
     } catch (error) {
       res.json({ error });
     }
    console.log("Data saved !!!");
    console.log(filepath);
  });
  }
}

cron.schedule('0 0 * * 0', () => {
  console.log('making weekly report generation...');
  reportgenrator();
});