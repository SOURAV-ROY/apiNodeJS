const request = require("supertest");
const app = require("../index");
const { User } = require("../models");

describe("Auth Forgot Password Rate Limiting", () => {
  beforeAll(() => {
    jest.spyOn(User, "findOne").mockResolvedValue(null);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should return 429 when rate limit is exceeded on /forgotpassword", async () => {
    const agent = request.agent(app);

    // Get CSRF Token and Session cookie
    const tokenRes = await agent.get("/api/v1/auth/csrf-token");
    const csrfToken = tokenRes.body.csrfToken;

    // Make 5 requests (the limit)
    for (let i = 0; i < 5; i++) {
      await agent
        .post("/api/v1/auth/forgotpassword")
        .set("x-csrf-token", csrfToken)
        .send({ email: `test${i}@example.com` });
    }

    // The 6th request should be rate limited and return 429
    const response = await agent
      .post("/api/v1/auth/forgotpassword")
      .set("x-csrf-token", csrfToken)
      .send({ email: "test6@example.com" });

    expect(response.status).toBe(429);
    expect(response.body.error).toMatch(/Too many password reset requests/i);
  });

  it("should return 429 when rate limit is exceeded on /login", async () => {
    const agent = request.agent(app);

    // Get CSRF Token and Session cookie
    const tokenRes = await agent.get("/api/v1/auth/csrf-token");
    const csrfToken = tokenRes.body.csrfToken;

    // Make 10 requests (the limit)
    for (let i = 0; i < 10; i++) {
      await agent
        .post("/api/v1/auth/login")
        .set("x-csrf-token", csrfToken)
        .send({ email: `test${i}@example.com`, password: "password123" });
    }

    // The 11th request should be rate limited and return 429
    const response = await agent
      .post("/api/v1/auth/login")
      .set("x-csrf-token", csrfToken)
      .send({ email: "test11@example.com", password: "password123" });

    expect(response.status).toBe(429);
    expect(response.body.error).toMatch(/Too many login attempts/i);
  });

  it("should return 400 validation error when resetting password with short or missing password", async () => {
    const agent = request.agent(app);

    // Get CSRF Token
    const tokenRes = await agent.get("/api/v1/auth/csrf-token");
    const csrfToken = tokenRes.body.csrfToken;

    // Test with missing password
    const resMissing = await agent
      .put("/api/v1/auth/resetpassword/dummytoken123")
      .set("x-csrf-token", csrfToken)
      .send({});

    expect(resMissing.status).toBe(400);
    expect(resMissing.body.success).toBe(false);

    // Test with password shorter than 6 characters
    const resShort = await agent
      .put("/api/v1/auth/resetpassword/dummytoken123")
      .set("x-csrf-token", csrfToken)
      .send({ password: "123" });

    expect(resShort.status).toBe(400);
    expect(resShort.body.success).toBe(false);
  });
});
