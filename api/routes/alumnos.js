var express = require("express");
var router = express.Router();
var models = require("../models");

const DEFAULT_PAGE = 1;
const DEFAULT_SIZE = 10;

router.get("/", (req, res, next) => {
  const page = parseInt(req.query.page) || DEFAULT_PAGE;
  const size = parseInt(req.query.size) || DEFAULT_SIZE;
  models.alumno
    .findAndCountAll({
      attributes: ["id", "apellido", "nombre", "dni", "id_carrera"],
      include: [
        {
          as: "Carrera-Relacionada",
          model: models.carrera,
          attributes: ["id", "nombre"],
        },
      ],
      order: [
        ["id", "ASC"],
      ],
      limit: size,
      offset: (page - 1) * size,
    })
    .then((alumnos) => res.send(alumnos))
    .catch((error) => {
      return next(error);
    });
});

const findAlumnoDni = (dni, { onSuccess, onNotFound, onError }) => {
  models.alumno
    .findOne({
      attributes: ["id", "apellido", "nombre", "dni", "id_carrera"],
      where: { dni },
    })
    .then((alumno) => (alumno ? onSuccess(alumno) : onNotFound()))
    .catch(() => onError());
};


router.post("/", (req, res) => {
  const nombre = req.body.nombre;
  const apellido = req.body.apellido;
  const dni = req.body.dni;
  const id_carrera = req.body.id_carrera;

  findAlumnoDni(dni, {
    onSuccess: (alumno) => {
      res.status(409).send('Bad request: Existe otro alumno con el mismo dni');
    },
    onError: () => res.sendStatus(500),
    onNotFound: () => {
      models.alumno
        .create({
          nombre: nombre,
          apellido: apellido,
          dni: dni,
          id_carrera: id_carrera
        })
        .then((alumno) => res.status(201).send({ id: alumno.id,nombre:alumno.nombre,apellido:alumno.apellido,dni:alumno.dni,id_carrera:alumno.id_carrera }))
        .catch((error) => {
          if (error == "SequelizeUniqueConstraintError: Validation error") {
            res.status(400).send("Bad request: existe otro alumno con el mismo id");
          } else {
            console.log(`Error al intentar insertar en la base de datos: ${error}`);
            res.sendStatus(500);
          }
        });
      },
  });
});

const findAlumno = (id, { onSuccess, onNotFound, onError }) => {
  models.alumno
    .findOne({
      attributes: ["id", "apellido", "nombre", "dni", "id_carrera"],
      where: { id },
    })
    .then((alumno) => (alumno ? onSuccess(alumno) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  findAlumno(req.params.id, {
    onSuccess: (alumno) => res.send(alumno),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

router.put("/:id", (req, res) => {
  const onSuccess = (alumno) =>
    alumno
      .update(
        {
          nombre: req.body.nombre,
          apellido: req.body.apellido,
          dni: req.body.dni,
          id_carrera: req.body.id_carrera,
        },
        { fields: ["nombre", "apellido", "dni", "id_carrera"] }
      )
      .then(() => res.sendStatus(200))
      .catch((error) => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send("Bad request: existe otro alumno con el mismo nombre");
        } else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`);
          res.sendStatus(500);
        }
      });
  findAlumno(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

router.delete("/:id", (req, res) => {
  const onSuccess = (alumno) =>
    alumno
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findAlumno(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

module.exports = router;
