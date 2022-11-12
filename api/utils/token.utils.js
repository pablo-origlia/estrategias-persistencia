require('dotenv').config();

const jwt = require('jsonwebtoken');

// accessTokens
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2m' });
}

const authorization = (req, res, next) => {
  const token = req.cookies.accesstoken;
  if (!token) {
    return res.status(403).json({ message: 'Token no enviado!' });
  }

  const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.status(403).json({ message: 'Token inválido!' });
    } else {
      req.user = user;
      next();
    }
  });
};

module.exports = { authorization, generateAccessToken };
