const request = require("supertest");
const app = require("../index");
const { User } = require("../models");

describe("Forgot Password Endpoint Security", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return generic success message when email is not registered (prevent email enumeration)", async () => {
    jest.spyOn(User, "findOne").mockResolvedValue(null);

    const agent = request.agent(app);
    const csrfRes = await agent.get("/api/v1/auth/csrf-token");
    const csrfToken = csrfRes.body.csrfToken;

    const res = await agent
      .post("/api/v1/auth/forgotpassword")
      .set("x-csrf-token", csrfToken)
      .send({ email: "nonexistent_user_xyz_12345@example.com" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      data: "Email sent if registered",
    });
    expect(res.body.user).toBeUndefined();
    expect(res.body.resetPasswordToken).toBeUndefined();
  });
});
