var request = require('supertest');
var app = require('../app');
const { sequelize } = require('../models');

let datoCarrera = {
  nombre: 'Tecnicatura Universitaria en Informática',
};
let datoMateria = {
  nombre: 'Programación 1',
};
let datoAlumno = {
  apellido: 'Origlia',
  nombre: 'Pablo',
  dni: 11222333,
};

let datoProfesor = {
  apellido: 'Marcelli',
  nombre: 'Pablo',
  dni: 14352333,
};

let datoProfesorMateria = {
  id_profesor: 1,
  id_materia: 1,
};

let validUser = {
  name: 'unahur',
  password: 'UNaHur1234',
};

var cookies;

describe('Test básicos de los métodos POST', () => {
  // Elimino todos los datos de las tablas de la base de datos de prueba.
  beforeAll(async () => {
    console.log('1 - beforeAll');
    await sequelize.sync({ force: true });
  });

  test('respuesta a /user/register', async () => {
    const res = await request(app).post('/user/register').send(validUser);
    // TODO: Agregar el JWT para completar apropiadamente el test.
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(201);
  });

  test('respuesta a /user/login', async () => {
    const res = await request(app).post('/user/login').send(validUser);
    // TODO: Agregar el JWT para completar apropiadamente el test.
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ message: 'Login exitoso!' });
    cookies = res.headers['set-cookie'];
    //console.log('La cookie tiene adentro: ' + cookies[0]);
  });

  test('respuesta a /car', async () => {
    const res = await request(app).post('/car').set('Cookie', cookies).send(datoCarrera);

    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(201);
  });

  test('respuesta a /mat', async () => {
    const res = await request(app).post('/mat').set('Cookie', cookies).send(datoMateria);

    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(201);
  });

  test('respuesta a /alu', async () => {
    const res = await request(app).post('/alu').set('Cookie', cookies).send(datoAlumno);
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(201);
  });

  test('respuesta a /prof', async () => {
    const res = await request(app).post('/prof').set('Cookie', cookies).send(datoProfesor);
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(201);
  });

  test('respuesta a /profmat', async () => {
    const res = await request(app).post('/profmat').set('Cookie', cookies).send(datoProfesorMateria);
    expect(res.header['content-type']).toBe('text/html; charset=utf-8');
    expect(res.statusCode).toBe(404);
  });
});

describe('Test básicos de los metodos GET', function () {
  test('respuesta a /car', async () => {
    const res = await request(app).get('/car').set('Cookie', cookies);
    // TODO: Agregar el JWT para completar apropiadamente el test.
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    //expect(res.body).toMatchObject([datoCarrera]);
  });

  test('respuesta a /mat', async () => {
    const res = await request(app).get('/mat').set('Cookie', cookies);
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ count: 1, rows: [datoMateria] });
  });

  test('respuesta a /alu', async () => {
    const res = await request(app).get('/alu').set('Cookie', cookies);
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ count: 1, rows: [datoAlumno] });
  });

  test('respuesta a /prof', async () => {
    const res = await request(app).get('/prof').set('Cookie', cookies);
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ count: 1, rows: [datoProfesor] });
  });

  test('respuesta a /profmat', async () => {
    const res = await request(app).get('/profmat').set('Cookie', cookies);
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    // TODO verificar que la relacion creada coincide.

    //expect(res.body.rows).objectContaining({ count: 1, rows: [datoProfesorMateria] });
    //expect(res.body).toEqual(expect.objectContaining(datoProfesorMateria));
  });
});
