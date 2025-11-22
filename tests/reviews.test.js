const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");

const connectDB = require("../db/db");

describe("Review Routes", () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should get all reviews", async () => {
    const res = await request(app).get("/api/v1/reviews");
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });
});
