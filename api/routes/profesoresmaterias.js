var express = require('express');
var router = express.Router();
var models = require('../models');

router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || parseInt(process.env.DEFAULT_PAGE);
  const size = parseInt(req.query.size) || parseInt(process.env.DEFAULT_SIZE);
  models.profesor_materia
    .findAndCountAll({
      attributes: ['id'],
      include: [
        {
          as: 'Profesor',
          model: models.profesor,
          attributes: ['id', 'apellido', 'nombre'],
        },
        {
          as: 'Materia',
          model: models.materia,
          attributes: ['id', 'nombre'],
        },
      ],
      order: [['id', 'ASC']],
      limit: size,
      offset: (page - 1) * size,
    })
    .then((profesoresmaterias) => res.send(profesoresmaterias))
    .catch(() => res.sendStatus(500));
});

const findProfesormateria = (id, { onSuccess, onNotFound, onError }) => {
  models.profesor_materia
    .findOne({
      attributes: ['id'],
      where: { id },
      include: [
        {
          as: 'Profesor',
          model: models.profesor,
          attributes: ['id', 'apellido', 'nombre'],
        },
        {
          as: 'Materia',
          model: models.materia,
          attributes: ['id', 'nombre'],
        },
      ],
      order: [['id', 'ASC']],
    })
    .then((profesormateria) => (profesormateria ? onSuccess(profesormateria) : onNotFound()))
    .catch(() => onError());
};


const findProfesormateriaRelacion = (id_materia, id_profesor, { onSuccess, onNotFound, onError }) => {
  models.profesor_materia
    .findOne({
      attributes: ['id'],
      where: {
        id_materia: id_materia,
        id_profesor: id_profesor
      },
    })
    .then((profesormateria) => (profesormateria ? onSuccess(profesormateria) : onNotFound()))
    .catch(() => onError());
};


router.post('/', (req, res) => {
  const id_profesor = req.body.id_profesor;
  const id_materia = req.body.id_materia;
  findProfesormateriaRelacion(id_profesor, id_materia, {
    onSuccess: (profesormateria) => {
      res.status(409).send('Bad request: Ya existe esa relación profesor-materia');
    },
    onError: () => res.sendStatus(500),
    onNotFound: () => {
      models.profesor_materia
        .create({
          id_profesor: id_profesor,
          id_materia: id_materia,
        })
        .then((profesormateria) => res.status(201).send({ id: profesormateria.id }))
        .catch((error) => {
          if (error == 'SequelizeUniqueConstraintError: Validation error') {
            res.status(400).send('Bad request: existe otro registro con los mismos datos');
          } else {
            console.log(`Error al intentar insertar en la base de datos: ${error}`);
            res.sendStatus(500);
          }
        });
      },
    });
});

router.get('/:id', (req, res) => {
  findProfesormateria(req.params.id, {
    onSuccess: (profesormateria) => res.send(profesormateria),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});


router.put('/:id', (req, res) => {
  const onSuccess = (profesormateria) =>
    profesormateria
      .update(
        {
          id_profesor: req.body.id_profesor,
          id_materia: req.body.id_materia,
        },
        { fields: ['id_profesor', 'id_materia'] }
      )
      .then(() => res.sendStatus(200))
      .catch((error) => {
        if (error == 'SequelizeUniqueConstraintError: Validation error') {
          res.status(400).send('Bad request: existe otro profesor_materia con el mismo nombre');
        } else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`);
          res.sendStatus(500);
        }
      });
  findProfesormateria(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

router.delete('/:id', (req, res) => {
  const onSuccess = (profesormateria) =>
    profesormateria
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findProfesormateria(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

module.exports = router;
