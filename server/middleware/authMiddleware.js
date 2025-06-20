// authMiddleWare.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log("Authorization header:", authHeader);

  const token = authHeader && authHeader.split(' ')[1];
  console.log("Extracted token:", token);

  if (!token) {
    console.log("No token provided");
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Token verification failed:", err.message);
      return res.sendStatus(403);
    }
    console.log("Token verified successfully, user payload:", user);
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
