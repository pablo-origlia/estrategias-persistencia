var express = require('express');
var router = express.Router();
var models = require('../models');

const bcrypt = require('bcrypt');
const tokenUtil = require('../utils/token.utils');

router.post('/register', async (req, res) => {
  const username = req.body.name;
  const hashedPassword = await bcrypt.hash(req.body.password, parseInt(process.env.SALT_GEN));

  // Se busca si el nombre de usuario ya existe, en caso de no estar registrado,
  // se registra. Sino 'HTTP error 409 Conflict'.
  findUser(username, {
    onSuccess: (user) => {
      res.status(409).json({ message: 'Ya existe otro usuario con el mismo nombre!' });
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

// Endpoint para chequear el registro de un Usuario
router.get('/:username', (req, res) => {
  findUser(req.params.username, {
    onSuccess: (user) => res.send(user),
    onNotFound: () => res.status(404).json({ message: 'Usuario no registrado!' }),
    onError: () => res.sendStatus(500),
  });
});

// JWT Endpoints con Cookies
router.post('/login', async (req, res) => {
  const username = req.body.name;

  findUser(username, {
    onSuccess: async (user) => {
      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (validPassword) {
        const accessToken = tokenUtil.generateAccessToken({ user: req.body.name });

        res
          .cookie('accesstoken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
          })
          .status(200)
          .json({ message: 'Login exitoso!' });
      } else {
        res.status(401).json({ message: 'Password incorrecto!' });
      }
    },
    onError: () => res.sendStatus(500),
    onNotFound: () => {
      res.status(404).json({ message: 'No existe usuario!, por favor registrese.' });
    },
  });
});

router.delete('/logout', tokenUtil.authorization, (req, res) => {
  return res.clearCookie('accesstoken').status(200).json({ message: 'Logout exitoso!' });
});

module.exports = router;
