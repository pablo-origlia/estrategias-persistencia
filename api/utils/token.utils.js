const jwt = require('jsonwebtoken');
require('dotenv').config();

// accessTokens
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2m' });
}

// refreshTokens
let refreshTokens = [];

function generateRefreshToken(user) {
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '5m' });
  refreshTokens.push(refreshToken);
  return refreshToken;
}

function removeRefreshToken(token) {
  refreshTokens = refreshTokens.filter((c) => c != token);
  //refreshTokens.pull(refreshToken);
}

function isValidRefreshToken(token) {
  return refreshTokens.includes(token);
}

function validateToken(req, res, next) {
  //get token from request header
  const authHeader = req.headers['authorization'];

  if (authHeader == undefined) {
    res.status(400).send('Token not present');
  } else {
    const token = authHeader.split(' ')[1];
    // the request header contains the token "Bearer <token>", split the string
    // and use the second value in the split array.

    if (token == null) res.status(400).send('Token not present');

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        res.status(403).send('Token invalid');
      } else {
        req.user = user;
        next();
      }
    });
  }
}

module.exports = { generateAccessToken, generateRefreshToken, removeRefreshToken, isValidRefreshToken, validateToken };
