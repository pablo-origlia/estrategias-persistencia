var request = require("supertest");
var app = require("../app");

describe("Test básicos de los metodos GET", function () {
  test("respuesta a /car", async () => {
    const res = await request(app).get("/car");
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject([]);
  });

  test("respuesta a /mat", async () => {
    const res = await request(app).get("/mat");
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject([]);
  });

  test("respuesta a /alu", async () => {
    const res = await request(app).get("/alu");
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject([]);
  });
});
