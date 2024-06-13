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
const md5 = require('md5');

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
  const newPassword= md5(password)
  console.log("registration pass:  ",newPassword);
  try {
    const newUser = await user.create({
      username,
      email,
      password:newPassword,
    });
    res.json({ message: "Registration successful" });
  } catch (error) {
    res.json({ error: error.message });
  }
};
exports.forgetpassword = async(req,res)=>{
  const {email,password}=req.body;
  console.log(req.body);
  const newPassword= md5(password)
  console.log("forget apssword:  ",newPassword);
  try {
   const forgetPassword= await user.update(
    { password :newPassword },
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
  try {
  var { email,password } = req.body;
  const newPassword= md5(password)
  console.log("login password",password);
  console.log("md5 password",newPassword);
  password=newPassword
  const users = await user.findOne({ where: { email,password } });
  console.log("userdata",users);
  const logged=users.password
console.log("inserted data pass",logged);
  if (!users) {
    return res.json({ error: "Invalid email" });
  }
// if(users.password===newPassword){
  const token = jwt.sign({ id: users.id }, secretKey, { expiresIn: "3h" });
  res.cookie("token", token, { httpOnly: true });
  console.log("token", token);
  res.json({ token });

const sessions= await session.create({
 user_id:users.id,
 session_token:token
});
console.log(req.cookie);
  // }
}
  catch (error) {
    console.error("Error fetching medications:", error);
  }  
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
  }  
};

exports.logout = async (req, res) => {
  try {
    const token = req.cookies.token;
     await session.destroy({
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
    await session.destroy({
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
    if(result){
      res.redirect("/dashboard")
    }
  } catch (error) {
    res.json({ error: error.message });
  }
};