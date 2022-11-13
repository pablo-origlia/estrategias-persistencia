var request = require('supertest');
var app = require('../app');
const { sequelize } = require('../models');

let datoCarrera = {
  nombre: 'Tecnicatura Universitaria en Informática',
};

let datoCarrera02 = {
  nombre: 'Licenciatura en Informática',
};

let datoCarrera03 = {
  nombre: 'Ingeniería Eléctrica',
};

let datoCarrera04 = {
  nombre: 'Ingeniería Metalúrgica',
};

let datoCarrera05 = {
  nombre: 'Licenciatura en Diseño Industrial',
};

let datoMateria = {
  nombre: 'Programación 1',
};
let datoMateria02 = {
  nombre: 'Matemática 1',
};
let datoMateria03 = {
  nombre: 'Matematica 2',
};
let datoMateria04 = {
  nombre: 'Introducción al diseño',
};
let datoMateria05 = {
  nombre: 'Aleaciones 1',
};

let datoAlumno = {
  apellido: 'Origlia',
  nombre: 'Pablo',
  dni: 11222333,
};

let datoAlumno02 = {
  apellido: 'Farias',
  nombre: 'Silvana',
  dni: 45789286,
};

let datoProfesor = {
  apellido: 'Marcelli',
  nombre: 'Pablo',
  dni: 14352333,
};

let datoProfesor02 = {
  apellido: 'Sanchez',
  nombre: 'Roberto',
  dni: 33987456,
};

let datoProfesor03 = {
  apellido: 'Robles',
  nombre: 'Alberto',
  dni: 35947416,
};

let datoProfesor04 = {
  apellido: 'Rojo',
  nombre: 'Nicolas',
  dni: 26974561,
};

let datoProfesorMateria = {
  id_profesor: 1,
  id_materia: 1,
};

let datoProfesorMateria02 = {
  id_profesor: 2,
  id_materia: 2,
};

let datoProfesorMateria03 = {
  id_profesor: 3,
  id_materia: 3,
};

let datoProfesorMateria04 = {
  id_profesor: 4,
  id_materia: 4,
};

let datoProfesorMateria05 = {
  id_profesor: 4,
  id_materia: 5,
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

    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(201);
  });

  test('respuesta a /user/login', async () => {
    const res = await request(app).post('/user/login').send(validUser);

    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ message: 'Login exitoso!' });
    // GUARDO LA COOKIE PARA LOS SIGUIENTES TESTS
    cookies = res.headers['set-cookie'];
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
});

describe('Test básicos de los métodos GET', function () {
  test('respuesta a /car', async () => {
    const res = await request(app).get('/car').set('Cookie', cookies);

    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ count: 1, rows: [datoCarrera] });
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
});

describe('Test compuestos para tabla ProfesorMateria', function () {
  test('respuesta a POST /profmat', async () => {
    const res = await request(app).post('/profmat').set('Cookie', cookies).send(datoProfesorMateria);
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(201);
  });

  test('respuesta a GET /profmat', async () => {
    // Cargo el resto de los profesores
    var res_prof = await request(app).post('/prof').set('Cookie', cookies).send(datoProfesor02);
    res_prof = await request(app).post('/prof').set('Cookie', cookies).send(datoProfesor03);
    res_prof = await request(app).post('/prof').set('Cookie', cookies).send(datoProfesor04);
    // Cargo el resto de los materias
    var res_mat = await request(app).post('/mat').set('Cookie', cookies).send(datoMateria02);
    res_mat = await request(app).post('/mat').set('Cookie', cookies).send(datoMateria03);
    res_mat = await request(app).post('/mat').set('Cookie', cookies).send(datoMateria04);
    res_mat = await request(app).post('/mat').set('Cookie', cookies).send(datoMateria05);
    // Cargo el resto de las relaciones profesor-materia
    var res_profmat = await request(app).post('/profmat').set('Cookie', cookies).send(datoProfesorMateria02);
    res_profmat = await request(app).post('/profmat').set('Cookie', cookies).send(datoProfesorMateria03);
    res_profmat = await request(app).post('/profmat').set('Cookie', cookies).send(datoProfesorMateria04);
    res_profmat = await request(app).post('/profmat').set('Cookie', cookies).send(datoProfesorMateria05);
    // Obtengo todas las relaciones
    const res = await request(app).get('/profmat').set('Cookie', cookies);
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    // Comparo contenido
    expect(res.body).toEqual(
      expect.objectContaining({
        count: 5,
        rows: [
          { Materia: { id: 1, nombre: 'Programación 1' }, Profesor: { apellido: 'Marcelli', id: 1, nombre: 'Pablo' }, id: 1 },
          { Materia: { id: 2, nombre: 'Matemática 1' }, Profesor: { apellido: 'Sanchez', id: 2, nombre: 'Roberto' }, id: 2 },
          { Materia: { id: 3, nombre: 'Matematica 2' }, Profesor: { apellido: 'Robles', id: 3, nombre: 'Alberto' }, id: 3 },
          { Materia: { id: 4, nombre: 'Introducción al diseño' }, Profesor: { apellido: 'Rojo', id: 4, nombre: 'Nicolas' }, id: 4 },
          { Materia: { id: 5, nombre: 'Aleaciones 1' }, Profesor: { apellido: 'Rojo', id: 4, nombre: 'Nicolas' }, id: 5 },
        ],
      })
    );
  });
});

describe('Test básicos de los métodos PUT', () => {
  test('respuesta a /profmat', async () => {
    const res = await request(app).put('/profmat/1').set('Cookie', cookies).send(datoProfesorMateria02);

    expect(res.header['content-type']).toBe('text/plain; charset=utf-8');
    expect(res.statusCode).toBe(200);

    // Obtengo todas las relaciones
    const res_rel = await request(app).get('/profmat').set('Cookie', cookies);
    expect(res_rel.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res_rel.statusCode).toBe(200);
    // Comparo contenido
    expect(res_rel.body).toEqual(
      expect.objectContaining({
        count: 5,
        rows: [
          { Materia: { id: 2, nombre: 'Matemática 1' }, Profesor: { apellido: 'Sanchez', id: 2, nombre: 'Roberto' }, id: 1 },
          { Materia: { id: 2, nombre: 'Matemática 1' }, Profesor: { apellido: 'Sanchez', id: 2, nombre: 'Roberto' }, id: 2 },
          { Materia: { id: 3, nombre: 'Matematica 2' }, Profesor: { apellido: 'Robles', id: 3, nombre: 'Alberto' }, id: 3 },
          { Materia: { id: 4, nombre: 'Introducción al diseño' }, Profesor: { apellido: 'Rojo', id: 4, nombre: 'Nicolas' }, id: 4 },
          { Materia: { id: 5, nombre: 'Aleaciones 1' }, Profesor: { apellido: 'Rojo', id: 4, nombre: 'Nicolas' }, id: 5 },
        ],
      })
    );
  });

  test('respuesta a /car', async () => {
    const res = await request(app).put('/car/1').set('Cookie', cookies).send(datoCarrera02);

    expect(res.header['content-type']).toBe('text/plain; charset=utf-8');
    expect(res.statusCode).toBe(200);
  });

  test('respuesta a /mat', async () => {
    const res = await request(app).put('/mat/1').set('Cookie', cookies).send(datoMateria02);

    expect(res.header['content-type']).toBe('text/plain; charset=utf-8');
    expect(res.statusCode).toBe(200);
  });

  test('respuesta a /alu', async () => {
    const res = await request(app).put('/alu/1').set('Cookie', cookies).send(datoAlumno02);

    expect(res.header['content-type']).toBe('text/plain; charset=utf-8');
    expect(res.statusCode).toBe(200);
  });

  test('respuesta a /prof', async () => {
    const res = await request(app).put('/prof/1').set('Cookie', cookies).send(datoProfesor02);

    expect(res.header['content-type']).toBe('text/plain; charset=utf-8');
    expect(res.statusCode).toBe(200);
  });
});

describe('Test básicos de los métodos DELETE', () => {
  test('respuesta a /profmat', async () => {
    const res = await request(app).delete('/profmat/1').set('Cookie', cookies);

    expect(res.header['content-type']).toBe('text/plain; charset=utf-8');
    expect(res.statusCode).toBe(200);
  });

  test('respuesta a /car', async () => {
    const res = await request(app).delete('/car/1').set('Cookie', cookies);

    expect(res.header['content-type']).toBe('text/plain; charset=utf-8');
    expect(res.statusCode).toBe(200);
  });

  test('respuesta a /mat', async () => {
    const res = await request(app).delete('/mat/1').set('Cookie', cookies);

    expect(res.header['content-type']).toBe('text/plain; charset=utf-8');
    expect(res.statusCode).toBe(200);
  });

  test('respuesta a /alu', async () => {
    const res = await request(app).delete('/alu/1').set('Cookie', cookies);

    expect(res.header['content-type']).toBe('text/plain; charset=utf-8');
    expect(res.statusCode).toBe(200);
  });

  test('respuesta a /prof', async () => {
    const res = await request(app).delete('/prof/1').set('Cookie', cookies);

    expect(res.header['content-type']).toBe('text/plain; charset=utf-8');
    expect(res.statusCode).toBe(200);
  });

  test('respuesta a /user/logout', async () => {
    const res = await request(app).delete('/user/logout').set('Cookie', cookies).send(validUser);

    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ message: 'Logout exitoso!' });
  });
});
