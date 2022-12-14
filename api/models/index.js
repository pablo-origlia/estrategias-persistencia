'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const logSql = fs.createWriteStream('./logs/api-sql.log', { flags: 'a' });

const logHandler = (msg) => {
  // Se mantiene el comportamiento por defecto
  console.log(msg);
  // Se redirecciona el flujo de datos al archivo correspondiente, con el agregado del timestamp.
  logSql.write('[' + new Date().toUTCString() + '] ' + msg + '\n');
};

// Se agrega la configuracion logging nueva a los parámeteros de confirguración del Sequelize.
config.logging = logHandler;

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Se recorre el directorio y cargan los modelos de cada entidad en el ORM.
fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
  })
  .forEach((file) => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Se exporta la funcion de logging de peticiones.
db.logHandler = logHandler;

module.exports = db;
