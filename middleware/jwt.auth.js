const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const CryptoJS = require("crypto-js")
dotenv.config();

const key = process.env.ACCESS_TOKEN_SECRET;

async function authenticateToken(req, res, next) {
  const token = req.query.ats;
  if (token == null) {
    return res.status(401).send({ message: "Token not found" });
  }

  try {
    const user = jwt.verify(token, key, { algorithm: 'HS256' });     
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).send({ message: "Token expired" });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(403).send({ message: "Invalid token format" });
    } else {
      return res.status(500).send({ message: "Internal server error" });
    }
  }
}

module.exports = { authenticateToken }
