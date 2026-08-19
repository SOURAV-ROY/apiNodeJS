const request = require("supertest");
const app = require("../index");

describe("MongoSanitize Middleware", () => {
  it("should sanitize NoSQL injection operators ($) in request body", async () => {
    const agent = request.agent(app);

    // Fetch CSRF Token
    const csrfRes = await agent.get("/api/v1/auth/csrf-token");
    const csrfToken = csrfRes.body.csrfToken;

    // Attempt a login request with a NoSQL injection payload in email field
    const res = await agent
      .post("/api/v1/auth/login")
      .set("x-csrf-token", csrfToken)
      .send({
        email: { $gt: "" },
        password: "password123",
      });

    // Since { $gt: "" } is sanitized, email property becomes {} and user lookup won't match, returning 400
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
