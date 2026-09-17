const { User } = require("../models");

describe("UserModel Validation", () => {
  it("should validate User schema when role is 'admin'", () => {
    const user = new User({
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
    });
    const validationError = user.validateSync();
    expect(validationError).toBeUndefined();
  });

  it("should validate User schema when role is 'publisher'", () => {
    const user = new User({
      name: "Publisher User",
      email: "publisher@example.com",
      password: "password123",
      role: "publisher",
    });
    const validationError = user.validateSync();
    expect(validationError).toBeUndefined();
  });

  it("should validate User schema when role is 'user'", () => {
    const user = new User({
      name: "Regular User",
      email: "user@example.com",
      password: "password123",
      role: "user",
    });
    const validationError = user.validateSync();
    expect(validationError).toBeUndefined();
  });

  it("should fail validation when role is invalid", () => {
    const user = new User({
      name: "Invalid User",
      email: "invalid@example.com",
      password: "password123",
      role: "superadmin",
    });
    const validationError = user.validateSync();
    expect(validationError).toBeDefined();
    expect(validationError.errors.role).toBeDefined();
  });
});
