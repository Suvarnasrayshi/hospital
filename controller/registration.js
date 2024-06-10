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
  const { email } = req.body;

  const users = await user.findOne({ where: { email } });

  if (!users) {
    return res.json({ error: "Invalid email" });
  }

  const token = jwt.sign({ id: users.id }, secretKey, { expiresIn: "3h" });
  res.cookie("token", token, { httpOnly: true });
  console.log("token", token);
  res.json({ token });

};

exports.dashboard = async (req, res) => {

  const userId = req.user.id;

  try {
    const userMedications = await medication.findAll({
      where: {
        user_id: userId,
      },
    });

    res.render("dashboard", { userMedications });
  } catch (error) {
    console.error("Error fetching user medications:", error);
    res.send("Error fetching user medications");
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
    res.clearCookie("token");
    res.redirect("/login");
  } catch (error) {
    res.json({ error: error.message });
  }
};