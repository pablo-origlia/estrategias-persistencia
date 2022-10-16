"use strict";
module.exports = (sequelize, DataTypes) => {
  const materia = sequelize.define(
    "materia",
    {
      nombre: DataTypes.STRING,
      id_carrera: DataTypes.INTEGER,
    },
    {}
  );
  materia.associate = function (models) {
    materia.belongsTo(models.carrera, {
      as: "Carrera-Relacionada",
      foreignKey: "id_carrera",
    }),
    materia.hasMany(models.profesor_materia,   // Modelo al que pertenece
      {
        as: "Profesor-Relacionado",            // nombre de la relacion
        foreignKey: "id_materia",               // campo con el que voy a igualar 
        onDelete: "cascade", 
        hooks: true 
      })
  };
  return materia;
};
