const express = require("express");
const app = express();
const sequelize = require("../utils/database");
const Sequelize = require("sequelize");
app.set("view engine", "ejs");
const router = express.Router();
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const { user, medication } = require('../models')
app.use(bodyParser.urlencoded({ extended: true }));

  exports.addMedication = async (req, res) => {
  const { name, description, type, date, start_date, end_date, time, day_week,rec_type } = req.body;

  try {
    console.log(req.user);
    const user_id = req.user.id; 
    if (type === 'one-time') {
      newMedication = await medication.create({
        user_id,
        name,
        description,
        type,
        date,
        time,
        mark_as_done:0
      });
    } else if (type === 'recurring') {
    //   if(rec_type==='daily'){
    //   newMedication = await medication.create({
    //     user_id,
    //     name,
    //     description,
    //     type,
    //     rec_type,
    //     start_date,
    //     end_date,
    //     time,
    //     mark_as_done:0
    //   });
    // }
    // if(rec_type === 'weekly'){
      newMedication = await medication.create({
        user_id,
        name,
        description,
        type,
        rec_type,
        start_date,
        end_date,
        time,
        day_week, //(monday,tuesday)
        mark_as_done:0
      });
    // }
    } else {
      return res.status(400).json({ error: 'Invalid medication type' });

    }
   ;

  } catch (error) {
    res.status(500).json({ error: 'Failed to add medication' });
  }

   medicationdata = await medication.findAll();
   res.render('dashboard', { medicationdata })
};


exports.addmedicationonce = async (req, res) => {
  res.render("addmedicationonce")
}
exports.addmedicationrecuring = async (req, res) => {
  res.render("addmedicationrecuring")
}