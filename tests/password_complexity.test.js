const {
  registerSchema,
  resetPasswordSchema,
  updatePasswordSchema,
} = require("../utils/validators/authValidator");

describe("Password Complexity Validation", () => {
  const validUser = {
    name: "John Doe",
    email: "john@example.com",
  };

  it("should accept strong passwords with uppercase, lowercase, digit, and special char", () => {
    const validPasswords = [
      "P@ssword123",
      "S3cur3!Pass",
      "Complex#1Pass",
      "Strong$9Key",
    ];

    validPasswords.forEach((password) => {
      const { error: regErr } = registerSchema.validate({
        ...validUser,
        password,
      });
      expect(regErr).toBeUndefined();

      const { error: resetErr } = resetPasswordSchema.validate({ password });
      expect(resetErr).toBeUndefined();

      const { error: updateErr } = updatePasswordSchema.validate({
        currentPassword: "OldPassword123!",
        newPassword: password,
      });
      expect(updateErr).toBeUndefined();
    });
  });

  it("should reject passwords that lack uppercase, lowercase, digit, or special char", () => {
    const weakPasswords = [
      "password123!", // Missing uppercase
      "PASSWORD123!", // Missing lowercase
      "Password!", // Missing digit
      "Password123", // Missing special character
      "P1!", // Too short (< 6 chars)
    ];

    weakPasswords.forEach((password) => {
      const { error: regErr } = registerSchema.validate({
        ...validUser,
        password,
      });
      expect(regErr).toBeDefined();

      const { error: resetErr } = resetPasswordSchema.validate({ password });
      expect(resetErr).toBeDefined();

      const { error: updateErr } = updatePasswordSchema.validate({
        currentPassword: "OldPassword123!",
        newPassword: password,
      });
      expect(updateErr).toBeDefined();
    });
  });
});
