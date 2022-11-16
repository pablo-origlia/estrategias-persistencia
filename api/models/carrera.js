'use strict';
module.exports = (sequelize, DataTypes) => {
  const carrera = sequelize.define(
    'carrera',
    {
      nombre: DataTypes.STRING,
    },
    {}
  );
  carrera.associate = function (models) {
    carrera.hasMany(models.alumno, {
      as: 'Alumno-Relacionado',
      foreignKey: 'id_carrera',
      /*onDelete: "CASCADE", 
      hooks: true*/
    });
    carrera.hasMany(models.materia, {
      as: 'Materia-Relacionada',
      foreignKey: 'id_carrera',
      /*onDelete: "CASCADE", 
      hooks: true*/
    });
  };
  return carrera;
};

/*
"use strict";
module.exports = (sequelize, DataTypes) => {
  const carrera = sequelize.define(
    "carrera",
    {
      nombre: DataTypes.STRING,
    },
    {}
  );
  return carrera;
};
*/
