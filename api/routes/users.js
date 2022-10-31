var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');

var models = require('../models');

const tokenUtil = require('../utils/token.utils');

router.post('/', async (req, res) => {
  const username = req.body.name;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  // Se busca si el nombre de usuario ya existe, en caso de no estar registrado,
  // se registra. Sino 'HTTP error 409 Conflict'.
  findUser(username, {
    onSuccess: (user) => {
      res.status(409).send('Bad request: existe otro user con el mismo nombre');
    },
    onError: () => res.sendStatus(500),
    onNotFound: () => {
      models.user
        .create({
          username: username,
          password: hashedPassword,
        })
        .then((user) => res.status(201).send({ id: user.id, username: user.username, password: user.password }))
        .catch((error) => {
          if (error == 'SequelizeUniqueConstraintError: Validation error') {
            res.status(400).send('Bad request: existe otro user con el mismo nombre');
          } else {
            console.log(`Error al intentar insertar en la base de datos: ${error}`);
            res.sendStatus(500);
          }
        });
    },
  });
});

const findUser = (username, { onSuccess, onNotFound, onError }) => {
  models.user
    .findOne({
      attributes: ['username', 'password'],
      where: { username },
    })
    .then((user) => (user ? onSuccess(user) : onNotFound()))
    .catch(() => onError());
};

/*
// Endpoint para chequear el registro de un Usuario
router.get('/:username', (req, res) => {
  findUser(req.params.username, {
    onSuccess: (user) => res.send(user),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});
*/

////////// JWT Endpoints
router.post('/login', async (req, res) => {
  const username = req.body.name;

  findUser(username, {
    onSuccess: (user) => {
      if (bcrypt.compare(req.body.password, user.password)) {
        const accessToken = tokenUtil.generateAccessToken({ user: req.body.name });

        const refreshToken = tokenUtil.generateRefreshToken({ user: req.body.name });

        res.json({ accessToken: accessToken, refreshToken: refreshToken });
      } else {
        res.status(401).send('Password Incorrect!');
      }
    },
    onError: () => res.sendStatus(500),
    onNotFound: () => {
      res.status(404).send('User does not exist!');
    },
  });
});

//REFRESH TOKEN API
router.post('/refreshToken', (req, res) => {
  if (!tokenUtil.isValidRefreshToken(req.body.token)) {
    console.log(req.body.token);
    res.status(400).send('Refresh Token Invalid');
  } else {
    //if (!refreshTokens.includes(req.body.token)) res.status(400).send('Refresh Token Invalid');

    //refreshTokens = refreshTokens.filter((c) => c != req.body.token);
    tokenUtil.removeRefreshToken(req.body.token);
    //remove the old refreshToken from the refreshTokens list

    const accessToken = tokenUtil.generateAccessToken({ user: req.body.name });
    const refreshToken = tokenUtil.generateRefreshToken({ user: req.body.name });
    //generate new accessToken and refreshTokens

    res.json({ accessToken: accessToken, refreshToken: refreshToken });
  }
});

router.delete('/logout', (req, res) => {
  if (!tokenUtil.isValidRefreshToken(req.body.token)) {
    res.status(400).send('Refresh Token Invalid');
  } else {
    tokenUtil.removeRefreshToken(req.body.token);
    //refreshTokens = refreshTokens.filter((c) => c != req.body.token);
    //remove the old refreshToken from the refreshTokens list
    res.status(204).send('Logged out!');
  }
});

//////////

module.exports = router;
