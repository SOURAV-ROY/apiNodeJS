const request = require("supertest");
const app = require("../index");

describe("Auth Logout Cookie Security", () => {
  it("should set secure cookie options on logout", async () => {
    const res = await request(app).get("/api/v1/auth/logout");

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);

    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();

    const tokenCookie = cookies.find((c) => c.startsWith("token="));
    expect(tokenCookie).toBeDefined();
    expect(tokenCookie).toContain("HttpOnly");
    expect(tokenCookie).toContain("SameSite=Strict");
    expect(tokenCookie).toContain("Path=/");
  });
});
