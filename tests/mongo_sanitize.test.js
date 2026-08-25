const request = require("supertest");
const app = require("../index");

describe("NoSQL Injection Sanitization", () => {
  it("should sanitize prohibited NoSQL operators from request body", async () => {
    const agent = request.agent(app);
    const csrfRes = await agent.get("/api/v1/auth/csrf-token");
    const csrfToken = csrfRes.body.csrfToken;

    // Send request with prohibited operator key ($gt) in body
    const res = await agent
      .post("/api/v1/auth/login")
      .set("x-csrf-token", csrfToken)
      .send({ email: { "$gt": "" }, password: "password123" });

    // The mongoSanitize middleware strips {$gt: ""} to {}, which causes validation error (email must be a string)
    expect(res.status).toBe(400);
    expect(res.body.error).toEqual({ email: "email must be a string" });
  });
});
