var request = require("supertest");
var app = require("../app");

describe("Test básicos de los metodos GET", function () {
  test("respuesta a /car", async () => {
    const res = await request(app).get("/car");
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject([
      { id: 1, nombre: "Ing Informática" },
      { id: 2, nombre: "Ing Electrónica" },
      { id: 3, nombre: "Ing Mecánica" },
      { id: 4, nombre: "Ing Robotica" },
      { id: 5, nombre: "Ing Civil" },
    ]);
  });

  test("respuesta a /mat", async () => {
    const res = await request(app).get("/mat");
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject([{ id: 1, nombre: "Programación 1", id_carrera: null, "Carrera-Relacionada": null }]);
  });

  test("respuesta a /alu", async () => {
    const res = await request(app).get("/alu");
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject([
      { id: 2, apellido: "Origlia", nombre: "Pablo", dni: 29904177, id_carrera: 1, "Carrera-Relacionada": { id: 1, nombre: "Ing Informática" } },
      { id: 3, apellido: "Perez", nombre: "Juan", dni: 32456234, id_carrera: 1, "Carrera-Relacionada": { id: 1, nombre: "Ing Informática" } },
      { id: 4, apellido: "Gomez", nombre: "Roberto", dni: 45776345, id_carrera: 3, "Carrera-Relacionada": { id: 3, nombre: "Ing Mecánica" } },
      { id: 5, apellido: "Golon", nombre: "Ernesto", dni: 45776345, id_carrera: 10, "Carrera-Relacionada": null },
    ]);
  });
});
