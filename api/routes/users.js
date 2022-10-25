var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');

var models = require('../models');

router.post('/', async (req, res) => {
  const username = req.body.name;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
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
});

module.exports = router;
