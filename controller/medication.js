const express = require("express");
const app = express();
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
const { user, medication, reminder } = require("../models");
app.use(bodyParser.urlencoded({ extended: true }));

exports.addMedication = async (req, res) => {
  const {
    name,
    description,
    type,
    date,
    start_date,
    end_date,
    time,
    day_week,
    rec_type,

  } = req.body;
  console.log(req.body);

  try {
    console.log(req.user);
    const user_id = req.user.id;
    let newMedication;
    if (type === "one-time") {
      console.log("object");
      try {
        newMedication = await medication.create({
          user_id,
          name,
          description,
          type,
          date,
          time,
          
        });
      } catch (error) {
        console.log(error);
      }
     
    } else if (type === "recurring") {
      if (rec_type === "daily") {
        newMedication = await medication.create({
          user_id,
          name,
          description,
          type,
          rec_type,
          start_date,
          end_date,
          time,
         
        });
      }
      if (rec_type === "weekly") {
        newMedication = await medication.create({
          user_id,
          name,
          description,
          type,
          rec_type,
          start_date,
          end_date,
          time,
          day_week,
          
        });
      }
    } else {
      return res.json({ error: "Invalid medication type" });
    }

    const medicationdata = await medication.findAll({ where: { user_id } });
    res
      .status(200)
      .json({ message: "Medication added successfully", medicationdata });
  } catch (error) {
    res.json({ error: "Failed to add medication" });
  }
};

exports.addmedicationonce = async (req, res) => {
  res.render("addmedicationonce");
};

exports.addmedicationrecuring = async (req, res) => {
  res.render("addmedicationrecuring");
};




exports.marksasdone = async (req, res) => {
  const { medication_id } = req.params;
  // console.log(req.params);
  try {
    const updatedMedication = await reminder.update(
      { mark_as_done: 1 },
      { where: { medication_id: medication_id } }
    );
    console.log(updatedMedication);
    res.render('partials/markasdone')
    // res.json({ message: 'Medication marked as done successfully' });
  } catch (error) {
    console.error('Error marking medication as done:', error);

  }
}


exports.deleteMedication = async (req, res) => {
  try {
    id = req.params.id
    const deleteMedication = await medication.destroy({
      where: {
        id: id,
      }
    })
    const userMedications = await medication.findAll({
      where: {
        user_id: req.user.id,
      },
    });

    res.render("dashboard", { userMedications });
  } catch (error) {
    console.log(eror);
  }
}


exports.updateMedication = async (req, res) => {
  try {
    id = req.params.id

    const { name, description, start_date, end_date, date, time, rec_type, type, day_week } = req.body

    const updateMedication = await medication.update(
      {
        name: name,
        description: description,
        start_date: start_date,
        end_date: end_date,
        date: date,
        time: time,
        rec_type: rec_type,
        type: type,
        day_week: day_week
      },
      {
        where: {
          id: id
        },
      },
    );
    res.redirect('/dashboard')
  } catch (error) {
    console.log(error);
  }
}



exports.selectMedication = async (req, res) => {

  id: req.params.id
  try {
    const showMedication = await medication.findAll({
      where: {
        id: req.params.id,
        type: "recurring"
      }
    })

    res.render('updateRecMedication', { showMedication })

  } catch (error) {
    console.log(error);
  }
}

exports.selectMedicationOnce = async (req, res) => {

  try {
    const showMedicationOnce = await medication.findAll({
      where: {
        id: req.params.id,
        type: "one-time"
      }
    })

    res.render('updateOnceMedication', { showMedicationOnce })

  } catch (error) {
    console.log(error);
  }
}