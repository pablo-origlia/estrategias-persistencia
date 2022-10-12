var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res, next) => {
  models.profesor
    .findAll({
      attributes: ["id", "apellido", "nombre", "dni"],
    })
    .then((profesores) => res.send(profesores))
    .catch((error) => {
      return next(error);
    });
});

module.exports = router;