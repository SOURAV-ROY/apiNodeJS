const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const { User } = require("../models");

const connectDB = require("../db");

describe("User Routes", () => {
  let token;
  let csrfToken;
  let cookies;
  const adminUser = {
    name: "Admin User",
    email: `admin_${Date.now()}@example.com`,
    password: "password123",
    role: "admin",
  };

  beforeAll(async () => {
    await connectDB();

    // Every non-GET request requires a lusca CSRF token plus its session cookie.
    const csrfRes = await request(app).get("/api/v1/auth/csrf-token");
    csrfToken = csrfRes.body.csrfToken;
    cookies = csrfRes.headers["set-cookie"];

    // Public registration deliberately strips the role (defaults to "user") and
    // the register schema rejects "admin", so seed the admin directly and obtain
    // a token through the real login flow.
    await User.create(adminUser);

    const res = await request(app)
      .post("/api/v1/auth/login")
      .set("x-csrf-token", csrfToken)
      .set("Cookie", cookies)
      .send({ email: adminUser.email, password: adminUser.password });

    token = res.body.token;
    if (!token) {
      throw new Error(
        `Login failed (${res.statusCode}): ${JSON.stringify(res.body)}`,
      );
    }
  });

  afterAll(async () => {
    await User.deleteOne({ email: adminUser.email });
    await mongoose.connection.close();
  });

  it("should get all users (admin only)", async () => {
    const res = await request(app)
      .get("/api/v1/users")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });

  it("should prevent admin from self-deleting via user management route", async () => {
    const meRes = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${token}`);

    const adminId = meRes.body.data._id;

    const deleteRes = await request(app)
      .delete(`/api/v1/users/${adminId}`)
      .set("Authorization", `Bearer ${token}`)
      .set("x-csrf-token", csrfToken)
      .set("Cookie", cookies);

    expect(deleteRes.statusCode).toEqual(400);
    expect(deleteRes.body.success).toBe(false);
    expect(deleteRes.body.error).toMatch(
      /Admin cannot delete their own account/i,
    );
  });

  it("should return 404 when getting, updating, or deleting a non-existent user ID", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();

    const getRes = await request(app)
      .get(`/api/v1/users/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(getRes.statusCode).toEqual(404);

    const updateRes = await request(app)
      .put(`/api/v1/users/${fakeId}`)
      .set("Authorization", `Bearer ${token}`)
      .set("x-csrf-token", csrfToken)
      .set("Cookie", cookies)
      .send({ name: "Updated Name" });
    expect(updateRes.statusCode).toEqual(404);

    const deleteRes = await request(app)
      .delete(`/api/v1/users/${fakeId}`)
      .set("Authorization", `Bearer ${token}`)
      .set("x-csrf-token", csrfToken)
      .set("Cookie", cookies);
    expect(deleteRes.statusCode).toEqual(404);
  });
});
