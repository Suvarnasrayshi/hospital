const jwt = require('jsonwebtoken');
require('dotenv').config();
const { session } = require("../models");

const secretKey = process.env.SECRET_KEY;

const authenticate = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
   next()
  }

 else{
  jwt.verify(token, secretKey,async (err, decoded) => {
    if (err) {
      return res.json({ error: 'Failed to authenticate token' });
    }
    let result =await session.findOne({
      where:{
        user_id:decoded.id,
        session_token:req.cookies.token
      },
      raw:true
    });
    req.user = decoded;
    req.token = token;
    console.log(result);
    if(result){
      next();
    }
    else{
      
      res.redirect('/login')
    }
  });
 }
};



const loginwork = async(req , res , next) => {
  console.log(req.cookies.token)
  if(!req.cookies.token){
    next();
  }
  else{
    let decoded = jwt.verify(req.cookies.token , secretKey);

    let result = await session.findAndCountAll({
      where:{
        user_id:decoded.id,
        session_token:req.cookies.token
      },
      raw:true
    });

     console.log(result);
    if(result.count && result.rows[0].session_token == req.cookies.token){
      console.log("heeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
      return res.redirect('/dashboard');
    }
    else{
      next();
    }
  }
}

module.exports = { authenticate,loginwork};
