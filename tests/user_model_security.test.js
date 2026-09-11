const User = require("../models/UserModel");

describe("User Model Security Configuration", () => {
  it("should have select: false configured on password, resetPasswordToken, and resetPasswordExpire to prevent credential/token leakage", () => {
    const passwordPath = User.schema.path("password");
    const resetTokenPath = User.schema.path("resetPasswordToken");
    const resetExpirePath = User.schema.path("resetPasswordExpire");

    expect(passwordPath.options.select).toBe(false);
    expect(resetTokenPath.options.select).toBe(false);
    expect(resetExpirePath.options.select).toBe(false);
  });

  it("should include 'admin' in the user role enum", () => {
    const rolePath = User.schema.path("role");
    expect(rolePath.enumValues).toContain("admin");
    expect(rolePath.enumValues).toContain("user");
    expect(rolePath.enumValues).toContain("publisher");
  });
});
