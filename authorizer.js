const jwt = require("jsonwebtoken");
require("dotenv").config();

const authorizer = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    // If no token is found
    if (!token) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    // Verify the token using the secret key
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      console.log("decoded: ",decoded);
      req.user = decoded; 
      next(); 
    });
  };
  
module.exports = authorizer;