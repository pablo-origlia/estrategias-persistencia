var request = require("supertest");
var app = require("../app");
const { sequelize } = require("../models");

let datoCarrera = {
  nombre: "Tecnicatura Universitaria en Informática",
};
let datoMateria = {
  nombre: "Programación 1",
};
let datoAlumno = {
  apellido: "Origlia",
  nombre: "Pablo",
  dni: 11222333,
};

describe("Test básicos de los métodos POST", () => {
  // Elimino todos los datos de las tablas de la base de datos de prueba.
  beforeAll(async () => {
    console.log("1 - beforeAll");
    await sequelize.sync({ force: true });
  });

  test("respuesta a /car", async () => {
    const res = await request(app).post("/car").send(datoCarrera);
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.statusCode).toBe(201);
  });
  test("respuesta a /mat", async () => {
    const res = await request(app).post("/mat").send(datoMateria);
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.statusCode).toBe(201);
  });
  test("respuesta a /alu", async () => {
    const res = await request(app).post("/alu").send(datoAlumno);
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.statusCode).toBe(201);
  });
});

describe("Test básicos de los metodos GET", function () {
  test("respuesta a /car", async () => {
    const res = await request(app).get("/car");
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject([datoCarrera]);
  });

  test("respuesta a /mat", async () => {
    const res = await request(app).get("/mat");
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject([datoMateria]);
  });

  test("respuesta a /alu", async () => {
    const res = await request(app).get("/alu");
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject([datoAlumno]);
  });
});
