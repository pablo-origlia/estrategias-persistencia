var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');

var models = require('../models');

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
router.get('/:username', (req, res) => {
  findUser(req.params.username, {
    onSuccess: (user) => res.send(user),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});
*/

module.exports = router;
