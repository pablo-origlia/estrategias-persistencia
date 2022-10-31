require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const helmet = require('helmet');
const tokenUtil = require('./utils/token.utils');

var usersRouter = require('./routes/users');

var carrerasRouter = require('./routes/carreras');
var materiasRouter = require('./routes/materias');
var alumnosRouter = require('./routes/alumnos');
var profesoresRouter = require('./routes/profesores');
var profesoresmateriasRouter = require('./routes/profesoresmaterias');

var app = express();
////// https://medium.com/@HargitaiSoma/how-to-do-logging-in-an-express-api-part-1-14991856555
/////  https://ayuda.guebs.com/como-escribir-a-un-log-el-registro-de-tu-aplicacion-nodejs/
/////  Configuración para Morgan y creación del stream node.log
var fs = require('fs');
//var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/logs/api-http.log', { flags: 'a' });
app.use(logger('common', { stream: log_file }));
/////

// helps you secure your Express apps by setting various HTTP headers
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/car', tokenUtil.validateToken, carrerasRouter);
app.use('/mat', materiasRouter);
app.use('/alu', alumnosRouter);
app.use('/prof', profesoresRouter);
app.use('/profmat', profesoresmateriasRouter);

// Crear usuario
app.use('/user', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  /////  Configuración para Morgan y creación del stream node.log
  ///// Escribimos el error
  log_file.write(err.stack);
  /////

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
