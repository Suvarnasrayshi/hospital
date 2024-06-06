const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

const authenticate = async (req, res, next) => {
  const token = req.cookies.token;
  console.log("token", token);

  if (!token) {
    return res.render("login");
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.json({ error: 'Failed to authenticate token' });
    }

    req.user = decoded;
    req.token = token;
    next();
  });
};

module.exports = { authenticate };
