'use strict';
module.exports = (sequelize, DataTypes) => {
  const profesor = sequelize.define('profesor', {
    apellido: DataTypes.STRING,
    nombre: DataTypes.STRING,
    dni: DataTypes.INTEGER
  }, { tableName: "profesores" });
  profesor.associate = function(models) {
    // associations can be defined here
    profesor.hasMany(models.profesor_materia,   // Modelo al que pertenece
      {
        as: "Materia-Relacionada",              // nombre de la relacion
        foreignKey: "id_profesor"               // campo con el que voy a igualar 
      })
  };
  return profesor;
};


