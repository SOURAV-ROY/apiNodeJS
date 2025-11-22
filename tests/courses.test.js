const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");

describe("Course Routes", () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should get all courses", async () => {
    const res = await request(app).get("/api/v1/courses");
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });
});
