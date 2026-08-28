const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");
const request = require("supertest");

describe("NoSQL Query Injection Middleware", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    // Apply in-place sanitization middleware compatible with Express 5
    app.use((req, res, next) => {
      if (req.body) mongoSanitize.sanitize(req.body);
      if (req.params) mongoSanitize.sanitize(req.params);
      if (req.query) mongoSanitize.sanitize(req.query);
      next();
    });

    app.post("/test-sanitize/:id", (req, res) => {
      res.json({
        body: req.body,
        params: req.params,
        query: req.query,
      });
    });
  });

  it("should sanitize NoSQL injection operators from request body", async () => {
    const response = await request(app)
      .post("/test-sanitize/123")
      .send({ email: { "$gt": "" }, password: "password123" });

    expect(response.status).toBe(200);
    expect(response.body.body).toEqual({
      email: {},
      password: "password123",
    });
  });

  it("should sanitize NoSQL injection operators when present as objects in query parameters", async () => {
    // When extended query parsing or parsed objects are present in query params
    const req = { query: { role: { "$ne": "admin" } } };
    mongoSanitize.sanitize(req.query);
    expect(req.query).toEqual({ role: {} });
  });
});
