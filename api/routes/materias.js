var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res) => {
  console.log("Esto es un mensaje para ver en consola");
  models.materia
    .findAll({
      attributes: ["id", "nombre","id_carrera"],
    })
    .then((materias) => res.send(materias))
    .catch(() => res.sendStatus(500));
});

const findMateria = (id, { onSuccess, onNotFound, onError }) => {
    models.materia
      .findOne({
        attributes: ["id", "nombre","id_carrera"],
        where: { id }
      })
      .then(materia => (materia ? onSuccess(materia) : onNotFound()))
      .catch(() => onError());
  };
  router.get("/:id", (req, res) => {
    findMateria(req.params.id, {
      onSuccess: materia => res.send(materia),
      onNotFound: () => res.sendStatus(404),
      onError: () => res.sendStatus(500)
    });
  });