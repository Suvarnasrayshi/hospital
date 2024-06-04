const jwt = require('jsonwebtoken');
const secretKey = 'secret_key';


let loggedOutTokens = [];
const authenticate = async (req,res,next)=>{
  const token = req.cookies.token;
  console.log("token",token)
  if (!token) {
    res.render("login")
  }

  if (loggedOutTokens.includes(token)) {
    return res.json({ error: 'Token is logged out' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.json({ error: 'Failed to authenticate token' });
    }

    req.user = decoded;
    req.token = token;
    next();
  });
}

module.exports = { authenticate, loggedOutTokens, secretKey };
