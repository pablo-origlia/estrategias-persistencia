var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res, next) => {
  models.profesor
    .findAll({
      attributes: ["id", "apellido", "nombre", "dni"],

      include: [
        {
          as: "Materia-Relacionada",
          model: models.profesor_materia,
          attributes: ["id_materia"],
          include: [
            {
              as: "Materia",
              model: models.materia,
              attributes: ["nombre"]
            }
          ]
        }
      ]
    })
    .then((profesores) => res.send(profesores))
    .catch((error) => {
      return next(error);
    });
});

module.exports = router;