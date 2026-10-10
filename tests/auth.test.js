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

  const publisherEmail = `testpublisher_${Date.now()}@example.com`;

  afterAll(async () => {
    // Cleanup
    await User.deleteOne({ email: testUser.email });
    await User.deleteOne({ email: publisherEmail });
    await mongoose.connection.close();
  });

  it("should ignore requested role on public registration and default to 'user'", async () => {
    await getCsrfToken();
    const res = await request(app)
      .post("/api/v1/auth/register")
      .set("x-csrf-token", csrfToken)
      .set("Cookie", cookies)
      .send({
        name: "Test Publisher",
        email: publisherEmail,
        password: "password123",
        role: "publisher",
      });
    expect(res.statusCode).toEqual(200);

    const createdUser = await User.findOne({ email: publisherEmail });
    expect(createdUser).not.toBeNull();
    expect(createdUser.role).toEqual("user");
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
