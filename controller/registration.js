const express = require("express");
const app = express();
const Sequelize = require("sequelize");
app.set("view engine", "ejs");
const router = express.Router();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const { loggedOutTokens } = require("../middleware/authenticate");
const { user, medication, session } = require("../models");
const { Op } = require("sequelize");

require("dotenv").config();

const secretKey = process.env.SECRET_KEY;

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

exports.getregister = async (req, res) => {
  res.render("registration");
};

exports.registration = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const newUser = await user.create({
      username,
      email,
      password,
    });
    res.json({ message: "Registration successful" });
  } catch (error) {
    res.json({ error: error.message });
  }
};
exports.forgetpassword = async(req,res)=>{
  const {email,password}=req.body;
  console.log(req.body);
  try {
   const forgetPassword= await user.update(
    { password :password },
    { where: { email: email } }
    );
    console.log('Password updated successfully');
    res.redirect("/login");
    } catch (error) {
    console.error('Error updating password:', error);
    }
    
    };

exports.getforgetpassword = async(req,res)=>{
  res.render('forgetpassword')
}

exports.getlogin = async (req, res) => {
  res.render("login");
};

exports.login = async (req, res) => {
  // try {
  const { email,password } = req.body;

  const users = await user.findOne({ where: { email,password } });

  if (!users) {
    return res.json({ error: "Invalid email" });
  }

  const token = jwt.sign({ id: users.id }, secretKey, { expiresIn: "3h" });
  res.cookie("token", token, { httpOnly: true });
  console.log("token", token);
  res.json({ token });

const sessions= await session.create({
 user_id:users.id,
 session_token:token
});
console.log(req.cookie);
};

exports.dashboard = async (req, res) => {
  try {
    const oneTimeMedications = await medication.findAll({
      where: { user_id: req.user.id, type: 'one-time' },
    });
    const recurringMedications = await medication.findAll({
      where: { user_id: req.user.id, type: 'recurring' },
    });
    res.render('dashboard', { oneTimeMedications, recurringMedications });
  } catch (error) {
    console.error("Error fetching medications:", error);
    res.status(500).send("Internal Server Error");
  }  
};

exports.logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    const result = await session.destroy({
      where: { user_id: req.user.id, session_token: token },
    });
    res.clearCookie("token");
    res.redirect("/login");
  } catch (error) {
    console.log("logout from own function: " + error);
  }
};

exports.logoutalltheuser = async (req, res) => {
  try {
    const token = req.cookies.token;
    const result = await session.destroy({
      where: { user_id: req.user.id },
    });
   
      res.clearCookie("token");

      console.log(result);
    res.redirect("/login");
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.logoutothersevice = async (req, res) => {
  try {
    const token = req.cookies.token;
    user_id = req.user.id;
    const result = await session.destroy({
      where: {
        [Op.or]: {
          user_id: { [Op.ne]: user_id },
          session_token: { [Op.ne]: token },
        },
      },
    });
    if(result){
      res.redirect("/dashboard")
    }
  } catch (error) {
    res.json({ error: error.message });
  }
};