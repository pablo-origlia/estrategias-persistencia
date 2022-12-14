var express = require('express');
var router = express.Router();
var models = require('../models');

router.get('/', (req, res, next) => {
  const page = parseInt(req.query.page) || parseInt(process.env.DEFAULT_PAGE);
  const size = parseInt(req.query.size) || parseInt(process.env.DEFAULT_SIZE);
  models.materia
    .findAndCountAll({
      attributes: ['id', 'nombre', 'id_carrera'],

      include: [
        {
          as: 'Carrera-Relacionada',
          model: models.carrera,
          attributes: ['nombre'],
        },
        {
          as: 'Profesor-Relacionado',
          model: models.profesor_materia,
          attributes: ['id_profesor'],
          include: [
            {
              as: 'Profesor',
              model: models.profesor,
              attributes: ['apellido', 'nombre', 'dni'],
            },
          ],
        },
      ],
      order: [['id', 'ASC']],
      limit: size,
      offset: (page - 1) * size,
    })
    .then((materias) => res.send(materias))
    .catch((error) => {
      return next(error);
    });
});


router.get('/all', (req, res, next) => {
  models.materia
    .findAll({
      attributes: ['id','nombre','id_carrera'],
      order: [['id', 'ASC']],
    })
    .then((materia) => res.send(materia))
    .catch((error) => {
      return next(error);
    });
});


const findMateriaNombre = (nombre, { onSuccess, onNotFound, onError }) => {
  models.materia
    .findOne({
      attributes: ['id', 'nombre','id_carrera'],
      where: {nombre}
    })
    .then((materia) => (materia ? onSuccess(materia) : onNotFound()))
    .catch(() => onError());
};

router.post('/', (req, res) => {
  const nombre= req.body.nombre;
  findMateriaNombre(nombre,{
    onSuccess: (materia) => {
      res.status(409).send('Bad request: Existe otra materia con el mismo nombre');
    },
    onError: () => res.sendStatus(500),
    onNotFound: () => {
      models.materia
        .create({
          nombre: req.body.nombre,
          id_carrera: req.body.id_carrera,
        })
        .then((materia) => res.status(201).send({ id: materia.id }))
        .catch((error) => {
          if (error == 'SequelizeUniqueConstraintError: Validation error') {
            res.status(400).send('Bad request: existe otra materia con el mismo nombre');
          } else {
            console.log(`Error al intentar insertar en la base de datos: ${error}`);
            res.sendStatus(500);
          }
        });
      },
    }); 
});


const findMateriaContieneNombre = (nombre, { onSuccess, onNotFound, onError }) => {
  const { Op } = require("sequelize");
  models.materia
    .findAll({
      attributes: ['id', 'nombre','id_carrera'],
      where: {
        nombre: {
          [Op.substring]: nombre
        }
      }
    })
    .then((materia) => (materia ? onSuccess(materia) : onNotFound()))
    .catch(() => onError());
};

router.get('/search/:nombre', (req, res) => {
  findMateriaContieneNombre(req.params.nombre, {
    onSuccess: (materia) => res.send(materia),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

const findMateria = (id, { onSuccess, onNotFound, onError }) => {
  models.materia
    .findOne({
      attributes: ['id', 'nombre', 'id_carrera'],
      where: { id },
    })
    .then((materia) => (materia ? onSuccess(materia) : onNotFound()))
    .catch(() => onError());
};

router.get('/:id', (req, res) => {
  findMateria(req.params.id, {
    onSuccess: (materia) => res.send(materia),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

router.put('/:id', (req, res) => {
  const onSuccess = (materia) =>
    materia
      .update(
        {
          nombre: req.body.nombre,
          id_carrera: req.body.id_carrera,
        },
        { fields: ['nombre', 'id_carrera'] }
      )
      .then(() => res.sendStatus(200))
      .catch((error) => {
        if (error == 'SequelizeUniqueConstraintError: Validation error') {
          res.status(400).send('Bad request: existe otra materia con el mismo nombre');
        } else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`);
          res.sendStatus(500);
        }
      });
  findMateria(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

router.delete('/:id', (req, res) => {
  const onSuccess = (materia) =>
    materia
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findMateria(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

module.exports = router;
