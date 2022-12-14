var express = require('express');
var router = express.Router();
var models = require('../models');

router.get('/', (req, res, next) => {
  const page = parseInt(req.query.page) || parseInt(process.env.DEFAULT_PAGE);
  const size = parseInt(req.query.size) || parseInt(process.env.DEFAULT_SIZE);

  models.profesor
    .findAndCountAll({
      attributes: ['id', 'apellido', 'nombre', 'dni'],
      include: [
        {
          as: 'Materia-Relacionada',
          model: models.profesor_materia,
          attributes: ['id_materia'],
          include: [
            {
              as: 'Materia',
              model: models.materia,
              attributes: ['nombre'],
            },
          ],
        },
      ],
      order: [['id', 'ASC']],
      limit: size,
      offset: (page - 1) * size,
    })
    .then((profesores) => res.send(profesores))
    .catch((error) => {
      return next(error);
    });
});


router.get('/search/:dni', (req, res) => {
  findProfesorDni(req.params.dni, {
    onSuccess: (profesor) => res.send(profesor),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});


const findProfesorDni = (dni, { onSuccess, onNotFound, onError }) => {
  models.profesor
    .findOne({
      attributes: ['id', 'apellido', 'nombre', 'dni'],
      where: { dni },
    })
    .then((profesor) => (profesor ? onSuccess(profesor) : onNotFound()))
    .catch(() => onError());
};

router.get('/all', (req, res, next) => {
  models.profesor
    .findAll({
      attributes: ['id', 'apellido', 'nombre', 'dni'],
      order: [['id', 'ASC']],
    })
    .then((profesor) => res.send(profesor))
    .catch((error) => {
      return next(error);
    });
});

router.post('/', (req, res) => {
  const nombre = req.body.nombre;
  const apellido = req.body.apellido;
  const dni = req.body.dni;

  findProfesorDni(dni, {
    onSuccess: (profesor) => {
      res.status(409).send('Bad request: Existe otro profesor con el mismo dni');
    },
    onError: () => res.sendStatus(500),
    onNotFound: () => {
      models.profesor
        .create({
          nombre: req.body.nombre,
          apellido: req.body.apellido,
          dni: req.body.dni,
        })
        .then((profesor) => {
          res.status(201).send({ id: profesor.id });
        })
        .catch((error) => {
          if (error == 'SequelizeUniqueConstraintError: Validation error') {
            res.status(400).send('Bad request: existe otro profesor con el mismo id');
          } else {
            console.log(`Error al intentar insertar en la base de datos: ${error}`);
            res.sendStatus(500);
          }
        });
      },
    });
  });

const findProfesor = (id, { onSuccess, onNotFound, onError }) => {
  models.profesor
    .findOne({
      attributes: ['id' /*, "apellido", "nombre", "dni"*/],
      where: { id },
      include: [
        {
          as: 'Materia-Relacionada',
          model: models.profesor_materia,
          attributes: ['id_materia'],
          include: [
            {
              as: 'Materia',
              model: models.materia,
              attributes: ['nombre'],
            },
          ],
        },
      ],
    })
    .then((profesor) => (profesor ? onSuccess(profesor) : onNotFound()))
    .catch(() => onError());
};

router.get('/:id', (req, res) => {
  findProfesor(req.params.id, {
    onSuccess: (profesor) => res.send(profesor),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

router.put('/:id', (req, res) => {
  const onSuccess = (profesor) =>
    profesor
      .update(
        {
          nombre: req.body.nombre,
          apellido: req.body.apellido,
          dni: req.body.dni,
        },
        { fields: ['nombre', 'apellido', 'dni'] }
      )
      .then(() => res.sendStatus(200))
      .catch((error) => {
        if (error == 'SequelizeUniqueConstraintError: Validation error') {
          res.status(400).send('Bad request: existe otro profesor con el mismo nombre');
        } else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`);
          res.sendStatus(500);
        }
      });
  findProfesor(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

router.delete('/:id', (req, res) => {
  const onSuccess = (profesor) =>
    profesor
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findProfesor(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

module.exports = router;
