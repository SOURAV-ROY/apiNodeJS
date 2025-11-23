const request = require("supertest");
const app = require("../../index"); // Assuming index.js exports the app

describe("CSRF Token Endpoint", () => {
  it("should return a CSRF token", async () => {
    const res = await request(app).get("/api/v1/auth/csrf-token");
    console.log("Response:", res.body);
    if (res.status !== 200) {
      throw new Error(`Expected status 200 but got ${res.status}`);
    }
    if (!res.body.success) {
      throw new Error("Expected success to be true");
    }
    if (!res.body.csrfToken) {
      throw new Error("Expected csrfToken to be present");
    }
  });
});
