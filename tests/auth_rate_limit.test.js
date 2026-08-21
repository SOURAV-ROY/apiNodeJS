const request = require("supertest");
const app = require("../index");
const { User } = require("../models");

describe("Auth Rate Limiting", () => {
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

  it("should return 429 when rate limit is exceeded on /resetpassword/:resettoken", async () => {
    const agent = request.agent(app);

    // Get CSRF Token and Session cookie
    const tokenRes = await agent.get("/api/v1/auth/csrf-token");
    const csrfToken = tokenRes.body.csrfToken;

    // Make 10 requests (the limit)
    for (let i = 0; i < 10; i++) {
      await agent
        .put("/api/v1/auth/resetpassword/dummytoken123")
        .set("x-csrf-token", csrfToken)
        .send({ password: "newpassword123" });
    }

    // The 11th request should be rate limited and return 429
    const response = await agent
      .put("/api/v1/auth/resetpassword/dummytoken123")
      .set("x-csrf-token", csrfToken)
      .send({ password: "newpassword123" });

    expect(response.status).toBe(429);
    expect(response.body.error).toMatch(/Too many password reset attempts/i);
  });
});
