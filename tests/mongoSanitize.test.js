const mongoSanitize = require("express-mongo-sanitize");

describe("NoSQL Injection Protection (express-mongo-sanitize)", () => {
  it("should strip dollar signs ($) and dot (.) operators in-place from request objects", () => {
    const req = {
      body: { email: { "$gt": "" }, password: "secret" },
      query: { price: { "$gte": 100 } },
      params: { id: "123" },
    };

    // Simulate our index.js middleware logic
    if (req.body) mongoSanitize.sanitize(req.body);
    if (req.params) mongoSanitize.sanitize(req.params);
    if (req.query) mongoSanitize.sanitize(req.query);

    expect(req.body).toEqual({ email: {}, password: "secret" });
    expect(req.query).toEqual({ price: {} });
    expect(req.params).toEqual({ id: "123" });
  });
});
