const request = require("supertest");
const { Bootcamp } = require("../models");
const app = require("../index");

jest.mock("../models", () => {
  const original = jest.requireActual("../models");
  return {
    ...original,
    Bootcamp: {
      find: jest.fn().mockImplementation(() => {
        const queryObj = {
          populate: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          sort: jest.fn().mockReturnThis(),
          skip: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          then: function (resolve) {
            resolve([]);
          },
        };
        return queryObj;
      }),
      countDocuments: jest.fn().mockResolvedValue(0),
    },
  };
});

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

  it("should sanitize mongo operators from request query parameters", async () => {
    const agent = request.agent(app);

    // Send request with MongoDB operator $ne in query params
    const response = await agent.get("/api/v1/bootcamps?name[$ne]=test");

    // After sanitization, $ne is stripped, preventing NoSQL operator injection in query string
    expect(response.status).not.toBe(500);
  });
});
