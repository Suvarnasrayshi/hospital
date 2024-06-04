const express = require("express");
const app = express();
const Sequelize = require("sequelize");
app.set("view engine", "ejs");
const router = express.Router();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");
const { secretKey, loggedOutTokens } = require('../middleware/authenticate');
const {user,medication}=require('../models')


app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

exports.getregister=async(req,res)=>{
  res.render("registration");
}
exports.registration = async (req, res) => {
  const { username,email, password } = req.body;

  try {
   const register=await user.create({
    username,
    email,
    password,
   });
    //res.json({ message: 'User registered successfully' });
    res.render("login")
  } catch (error) {
    res.json({ error });
  }
};

exports.getlogin=async(req,res)=>{
  res.render("login")
}

exports.login=async(req,res)=>{
  try {
    const { email } = req.body;
    // const secretKey = 'secret_key';
    const users = await user.findOne({ where: { email } });

    if (!users) {
      return res.status(401).json({ error: 'Invalid email' });
    }
    console.log(secretKey);
    const token = jwt.sign({ id: users.id }, secretKey, { expiresIn: '3h' });
  //  res.json({ user: users });
    res.cookie('token', token, { httpOnly: true });
    // console.log(token);
    medicationdata = await medication.findAll();
   res.render('dashboard', { medicationdata })
    //res.status(200).json({ message: 'Logged in successfully' });
  } catch (error) {
    res.json({ error: error.message });
  }
}


exports.logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (token) {
      // Add token to logged out tokens array
      //loggedOutTokens.push(token);
      res.clearCookie('token');
    }
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.logoutalltheuser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (token) {
      const user = jwt.verify(token, secretKey);
      // Add all user's tokens to the logged out tokens array
      const userTokens = await getAllUserTokens(user.id); // Implement this function to get all tokens
      userTokens.forEach(userToken => loggedOutTokens.push(userToken));
      res.clearCookie('token');
    }
    res.status(200).json({ message: 'Logged out from all devices' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};