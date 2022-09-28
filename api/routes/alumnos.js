var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res,next) => {

  models.alumno.findAll({attributes: ["id","apellido","nombre","dni","id_carrera"],
      
      /////////se agrega la asociacion 
      include:[{as:'Carrera-Relacionada', model:models.carrera, attributes: ["id","nombre"]}]
      ////////////////////////////////

    }).then(alumnos => res.send(alumnos)).catch(error => { return next(error)});
});


module.exports = router;