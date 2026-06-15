const request = require("supertest");
const app = require("../index"); // Assuming index.js exports the app
const mongoose = require("mongoose");
const { User } = require("../models");

const connectDB = require("../db");

describe("Auth Routes", () => {
  let token;
  const testUser = {
    name: "Test User",
    email: `testuser_${Date.now()}@example.com`,
    password: "password123",
    role: "user",
  };
  let csrfToken;
  let cookies;

  const getCsrfToken = async () => {
    const res = await request(app).get("/api/v1/auth/csrf-token");
    csrfToken = res.body.csrfToken;
    cookies = res.headers["set-cookie"];
  };

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    // Cleanup
    await User.deleteOne({ email: testUser.email });
    await mongoose.connection.close();
  });

  it("should register a new user", async () => {
    await getCsrfToken();
    const res = await request(app)
      .post("/api/v1/auth/register")
      .set("x-csrf-token", csrfToken)
      .set("Cookie", cookies)
      .send(testUser);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  it("should login the user", async () => {
    await getCsrfToken();
    const res = await request(app)
      .post("/api/v1/auth/login")
      .set("x-csrf-token", csrfToken)
      .set("Cookie", cookies)
      .send({
        email: testUser.email,
        password: testUser.password,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should get current user profile", async () => {
    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty("email", testUser.email);
  });
});
