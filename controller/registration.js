const express = require("express");
const app = express();
app.set("view engine", "ejs");
const router = express.Router();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");
const { secretKey } = require('../middleware/authenticate');
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

exports.login = async (req, res) => {
  try {
    const { email } = req.body;
    const users = await user.findOne({ where: { email } });

    if (!users) {
      return res.status(401).json({ error: 'Invalid email' });
    }

    const token = jwt.sign({ id: users.id }, secretKey, { expiresIn: '3h' });
    res.cookie('token', token, { httpOnly: true });
  } catch (error) {
    console.log(error);
  }
};

  exports.dashboard=async(req,res)=>{
    res.render('dashboard')
   
     
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








TypeError: Cannot destructure property 'email' of 'req.body' as it is undefined.
    at exports.login (/home/suvarna-sinha/Documents/hospital_healthandwellness/hospital/controller/registration.js:39:13)
    at Layer.handle [as handle_request] (/home/suvarna-sinha/Documents/hospital_healthandwellness/hospital/node_modules/express/lib/router/layer.js:95:5)
    at next (/home/suvarna-sinha/Documents/hospital_healthandwellness/hospital/node_modules/express/lib/router/route.js:149:13)
    at Route.dispatch (/home/suvarna-sinha/Documents/hospital_healthandwellness/hospital/node_modules/express/lib/router/route.js:119:3)
    at Layer.handle [as handle_request] (/home/suvarna-sinha/Documents/hospital_healthandwellness/hospital/node_modules/express/lib/router/layer.js:95:5)
    at /home/suvarna-sinha/Documents/hospital_healthandwellness/hospital/node_modules/express/lib/router/index.js:284:15
    at Function.process_params (/home/suvarna-sinha/Documents/hospital_healthandwellness/hospital/node_modules/express/lib/router/index.js:346:12)
    at next (/home/suvarna-sinha/Documents/hospital_healthandwellness/hospital/node_modules/express/lib/router/index.js:280:10)
    at Function.handle (/home/suvarna-sinha/Documents/hospital_healthandwellness/hospital/node_modules/express/lib/router/index.js:175:3)
    at router (/home/suvarna-sinha/Documents/hospital_healthandwellness/hospital/node_modules/express/lib/router/index.js:47:12)
