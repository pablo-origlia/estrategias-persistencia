'use strict';
module.exports = (sequelize, DataTypes) => {
  const alumno = sequelize.define('alumno', {
    apellido: DataTypes.STRING,
    nombre: DataTypes.STRING,
    dni: DataTypes.INTEGER,
    id_carrera: DataTypes.INTEGER
  }, {});


  alumno.associate = function(models) {

  	//asociacion a carrera (pertenece a:)
  	alumno.belongsTo(models.carrera// modelo al que pertenece
    ,{
      as : 'Carrera-Relacionada',  // nombre de mi relacion
      foreignKey: 'id_carrera'     // campo con el que voy a igualar
    })
  	/////////////////////

  };

  return alumno;
};