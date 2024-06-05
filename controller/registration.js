const express = require("express");
const app = express();
const Sequelize = require("sequelize");
app.set("view engine", "ejs");
const router = express.Router();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");
const { secretKey, loggedOutTokens } = require('../middleware/authenticate');
const {user,medication,session}=require('../models')


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
    res.render("login")
  } catch (error) {
    res.json({ error });
  }
};

exports.getlogin=async(req,res)=>{
  res.render("login")
}

// exports.login=async(req,res)=>{
//   try {
//     const { email } = req.body;

//     const users = await user.findOne({ where: { email } });

//     if (!users) {
//       return res.status(401).json({ error: 'Invalid email' });
//     }
//     console.log(secretKey);
//     const token = jwt.sign({ id: users.id }, secretKey, { expiresIn: '3h' });
//     res.cookie('token', token, { httpOnly: true });
//     console.log("object",token);
//     const sessions=await session.create({
//       user_id:users.id,
//       session_token:token
//      });
//     console.log(sessions);
//     medicationdata = await medication.findAll();
//    res.render('dashboard', { medicationdata })
//     res.status(200).json({ message: 'Logged in successfully' });
//   } catch (error) {
//     res.json({ error: error.message });
//   }
// }

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

  exports.dashboard=async(req,res)=>{
    medicationdata = await medication.findAll();
    userdetail=await user.findAll({
     
    });
    res.render('dashboard', { medicationdata,userdetail })
   
     
};



exports.logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    const result = await session.destroy({
      where: { user_id: req.user.id, session_token: token },
    });
    res.clearCookie("token");
  } catch (error) {
    console.log("logout from own function: "+error);
  }
};


exports.logoutalltheuser = async (req, res) => {
  try {
    const token = req.cookies.token;
    const result = await session.destroy({
      where: { user_id: req.user.id },
    });
    res.clearCookie("token");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.logoutothersevice = async (req, res) => {
  try {
    const token = req.cookies.token;
    user_id = req.user.id
    const result = await session.destroy({
      where: {
        [Op.or]: {
          user_id: { [Op.ne]: user_id },
          session_token: { [Op.ne]: token },
        },
      },
    })
    res.clearCookie("token");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};