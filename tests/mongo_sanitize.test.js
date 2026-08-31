const request = require("supertest");
const app = require("../index");

describe("NoSQL Query Injection Prevention Middleware", () => {
  it("should sanitize mongo operators from request body", async () => {
    const agent = request.agent(app);

    const tokenRes = await agent.get("/api/v1/auth/csrf-token");
    const csrfToken = tokenRes.body.csrfToken;

    // Send body with MongoDB operator $gt
    const response = await agent
      .post("/api/v1/auth/login")
      .set("x-csrf-token", csrfToken)
      .send({
        email: { $gt: "" },
        password: "password123",
      });

    // The validator will complain email is not a string (or invalid format), rather than allowing mongo operator injection
    expect(response.status).toBe(400);
  });
});
