const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const User = require("../models/UserModel");

const connectDB = require("../db/db");

describe("User Routes", () => {
  let token;
  const adminUser = {
    name: "Admin User",
    email: `admin_${Date.now()}@example.com`,
    password: "password123",
    role: "admin",
  };

  beforeAll(async () => {
    await connectDB();
    await request(app).post("/api/v1/auth/register").send(adminUser);
    const res = await request(app).post("/api/v1/auth/login").send({
      email: adminUser.email,
      password: adminUser.password,
    });
    token = res.body.token;
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
});
