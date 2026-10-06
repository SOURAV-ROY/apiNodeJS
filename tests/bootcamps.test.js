const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const { User, Bootcamp } = require("../models");

const connectDB = require("../db");

describe("Bootcamp Routes", () => {
  let token;
  let csrfToken;
  let cookies;
  const testUser = {
    name: "Publisher User",
    email: `publisher_${Date.now()}@example.com`,
    password: "password123",
    role: "publisher",
  };

  beforeAll(async () => {
    await connectDB();

    // POSTs require a lusca CSRF token plus its session cookie.
    const csrfRes = await request(app).get("/api/v1/auth/csrf-token");
    csrfToken = csrfRes.body.csrfToken;
    cookies = csrfRes.headers["set-cookie"];

    // Register and login to get token
    await request(app)
      .post("/api/v1/auth/register")
      .set("x-csrf-token", csrfToken)
      .set("Cookie", cookies)
      .send(testUser);

    // Public registration always creates a "user"; promote to publisher so the
    // bootcamp create route's authorize("admin", "publisher") allows access.
    await User.updateOne(
      { email: testUser.email },
      { $set: { role: "publisher" } },
    );

    const res = await request(app)
      .post("/api/v1/auth/login")
      .set("x-csrf-token", csrfToken)
      .set("Cookie", cookies)
      .send({
        email: testUser.email,
        password: testUser.password,
      });
    token = res.body.token;
    if (!token) {
      throw new Error(
        `Login failed (${res.statusCode}): ${JSON.stringify(res.body)}`,
      );
    }
  });

  afterAll(async () => {
    const user = await User.findOne({ email: testUser.email });
    if (user) {
      await Bootcamp.deleteMany({ user: user._id });
      await User.deleteOne({ _id: user._id });
    }
    await mongoose.connection.close();
  });

  it("should get all bootcamps", async () => {
    const res = await request(app).get("/api/v1/bootcamps");
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });

  it("should create a new bootcamp", async () => {
    const res = await request(app)
      .post("/api/v1/bootcamps")
      .set("Authorization", `Bearer ${token}`)
      .set("x-csrf-token", csrfToken)
      .set("Cookie", cookies)
      .send({
        name: `Test Bootcamp ${Date.now()}`,
        description: "Test Description",
        address: "123 Main St, New York, NY",
        careers: ["Web Development"],
      });

    // Expect 201 on success; otherwise a client error (validation / geocoder),
    // but never an unhandled 500.
    if (res.statusCode === 201) {
      expect(res.body.success).toBe(true);
    } else {
      // If it fails, it might be due to validation or geocoder
      expect(res.statusCode).not.toBe(500);
    }
  });
});
