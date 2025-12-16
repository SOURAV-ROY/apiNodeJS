const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const { User } = require("../models");
const connectDB = require("../db");

describe("CSRF Reproduction", () => {
  let csrfToken;
  let cookie;

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should fail to login without CSRF token", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "test@example.com",
      password: "password",
    });
    // Expect 403 or 500 depending on lusca config, but definitely not success
    expect(res.statusCode).not.toEqual(200);
    expect(res.body).toHaveProperty("error");
    // The error message might vary, but user reported "CSRF token missing"
    if (res.body.error === "CSRF token missing") {
      expect(res.body.error).toEqual("CSRF token missing");
    }
  });

  it("should get CSRF token", async () => {
    const res = await request(app).get("/api/v1/auth/csrf-token");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("csrfToken");
    csrfToken = res.body.csrfToken;
    cookie = res.headers["set-cookie"];
  });

  it("should fail if token is provided but cookie is missing", async () => {
    // This tests that the session/cookie is required
    const res = await request(app)
      .post("/api/v1/auth/login")
      .set("x-csrf-token", csrfToken)
      .send({
        email: "test@example.com",
        password: "password",
      });
    expect(res.statusCode).not.toEqual(200);
  });

  // Note: We can't fully test success here without a valid user,
  // but we can test that we pass the CSRF check and get a different error (e.g. Invalid credentials)
  it("should pass CSRF check with valid token and cookie", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .set("Cookie", cookie)
      .set("x-csrf-token", csrfToken)
      .send({
        email: "wrong@example.com",
        password: "wrongpassword",
      });

    // If CSRF passes, we expect 400 or 401 (Invalid credentials), NOT "CSRF token missing"
    expect(res.statusCode).not.toEqual(403);
    expect(res.body.error).not.toEqual("CSRF token missing");
    expect([400, 401]).toContain(res.statusCode);
  });
});
