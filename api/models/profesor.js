'use strict';
module.exports = (sequelize, DataTypes) => {
  const profesor = sequelize.define('profesor', {
    apellido: DataTypes.STRING,
    nombre: DataTypes.STRING,
    dni: DataTypes.INTEGER
  }, { tableName: "profesores" });
  profesor.associate = function(models) {
    // associations can be defined here
  };
  return profesor;
};