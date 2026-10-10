const request = require("supertest");
const app = require("../index");

describe("NoSQL Injection Prevention (mongoSanitize)", () => {
  it("should sanitize $ operators from request body", async () => {
    const agent = request.agent(app);

    // Fetch CSRF Token
    const csrfRes = await agent.get("/api/v1/auth/csrf-token");
    const csrfToken = csrfRes.body.csrfToken;

    // Attempt login with NoSQL injection operator in email field
    const res = await agent
      .post("/api/v1/auth/login")
      .set("x-csrf-token", csrfToken)
      .send({
        email: { $gt: "" },
        password: "password123",
      });

    // Should fail with 400 or 401 instead of internal server error
    expect(res.status).not.toBe(500);
    expect(res.body.success).toBe(false);
  });
});
