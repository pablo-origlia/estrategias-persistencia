var express = require('express');
var router = express.Router();
var models = require('../models');

router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || parseInt(process.env.DEFAULT_PAGE);
  const size = parseInt(req.query.size) || parseInt(process.env.DEFAULT_SIZE);
  models.carrera
    .findAndCountAll({
      attributes: ['id', 'nombre'],
      order: [['id', 'ASC']],
      limit: size,
      offset: (page - 1) * size,
    })
    .then((carreras) => res.send(carreras))
    .catch(() => res.sendStatus(500));
});

const findCarreraNombre = (nombre, { onSuccess, onNotFound, onError }) => {
  models.carrera
    .findOne({
      attributes: ['id', 'nombre'],
      where: { nombre },
    })
    .then((carrera) => (carrera ? onSuccess(carrera) : onNotFound()))
    .catch(() => onError());
};

const findCarreraContieneNombre = (nombre, { onSuccess, onNotFound, onError }) => {
  const { Op } = require("sequelize");
  models.carrera
    .findAll({
      attributes: ['id', 'nombre'],
      where: {
        nombre: {
          [Op.substring]: nombre
        }
      }
    })
    .then((carrera) => (carrera ? onSuccess(carrera) : onNotFound()))
    .catch(() => onError());
};


router.get('/search/:nombre', (req, res) => {
  findCarreraContieneNombre(req.params.nombre, {
    onSuccess: (carrera) => res.send(carrera),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

router.get('/all', (req, res, next) => {
  models.carrera
    .findAll({
      attributes: ['id','nombre'],
      order: [['id', 'ASC']],
    })
    .then((carrera) => res.send(carrera))
    .catch((error) => {
      return next(error);
    });
});


router.post('/', (req, res) => {
  const nombre = req.body.nombre;
  findCarreraNombre(nombre,{
    onSuccess: (carrera) => {
      res.status(409).send('Bad request: Existe otra carrera con el mismo nombre');
    },
    onError: () => res.sendStatus(500),
    onNotFound: () => {
      models.carrera
        .create({ nombre: nombre })
        .then((carrera) => res.status(201).send({ id: carrera.id }))
        .catch((error) => {
          if (error == 'SequelizeUniqueConstraintError: Validation error') {
            res.status(400).send('Bad request: existe otra carrera con el mismo nombre');
          } else {
            console.log(`Error al intentar insertar en la base de datos: ${error}`);
            res.sendStatus(500);
          }
      });
    },
  }); 
});


const findCarrera = (id, { onSuccess, onNotFound, onError }) => {
  models.carrera
    .findOne({
      attributes: ['id', 'nombre'],
      where: { id },
    })
    .then((carrera) => (carrera ? onSuccess(carrera) : onNotFound()))
    .catch(() => onError());
};

router.get('/:id', (req, res) => {
  findCarrera(req.params.id, {
    onSuccess: (carrera) => res.send(carrera),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

router.put('/:id', (req, res) => {
  const onSuccess = (carrera) =>
    carrera
      .update({ nombre: req.body.nombre }, { fields: ['nombre'] })
      .then(() => res.sendStatus(200))
      .catch((error) => {
        if (error == 'SequelizeUniqueConstraintError: Validation error') {
          res.status(400).send('Bad request: existe otra carrera con el mismo nombre');
        } else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`);
          res.sendStatus(500);
        }
      });
  findCarrera(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

router.delete('/:id', (req, res) => {
  const onSuccess = (carrera) =>
    carrera
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findCarrera(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

module.exports = router;
