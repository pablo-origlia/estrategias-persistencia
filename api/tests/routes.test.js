var request = require("supertest");
var app = require("../app");

describe("Good Home Routes", function () {
  test("responds to /car", async () => {
    const res = await request(app).get("/car");
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.statusCode).toBe(200);
    //expect(res.text).toEqual("[]");
  });

  test("responds to /mat", async () => {
    const res = await request(app).get("/mat");
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.statusCode).toBe(200);
    //expect(res.text).toEqual("[]");
  });

  test("responds to /alu", async () => {
    const res = await request(app).get("/alu");
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.statusCode).toBe(200);
    //expect(res.text).toEqual("[]");
  });
});
