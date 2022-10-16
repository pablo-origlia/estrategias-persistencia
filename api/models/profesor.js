'use strict';
module.exports = (sequelize, DataTypes) => {
  const profesor = sequelize.define('profesor', {
    apellido: DataTypes.STRING,
    nombre: DataTypes.STRING,
    dni: DataTypes.INTEGER
  }, { tableName: "profesores" });
  profesor.associate = function(models) {
    profesor.hasMany(models.profesor_materia,   
      {
        as: "Materia-Relacionada",              
        foreignKey: "id_profesor",              
        onDelete: "cascade", 
        hooks: true            
      })
  };
  return profesor;
};


