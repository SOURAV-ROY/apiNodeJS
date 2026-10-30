const { updatePassword } = require("../controllers/authController");
const { User } = require("../models");
const ErrorResponse = require("../utils/ErrorResponse");

jest.mock("../models", () => ({
  User: {
    findById: jest.fn(),
  },
}));

describe("updatePassword - Missing User Security Check", () => {
  it("should return a 404 ErrorResponse when user document is not found", async () => {
    const mockQuery = {
      select: jest.fn().mockResolvedValue(null),
    };
    User.findById.mockReturnValue(mockQuery);

    const req = {
      user: { id: "nonexistentuser123" },
      body: {
        currentPassword: "OldPassword123!",
        newPassword: "NewPassword123!",
      },
    };
    const res = {};
    const next = jest.fn();

    await updatePassword(req, res, next);

    expect(User.findById).toHaveBeenCalledWith("nonexistentuser123");
    expect(mockQuery.select).toHaveBeenCalledWith("+password");
    expect(next).toHaveBeenCalledWith(expect.any(ErrorResponse));

    const errorPassedToNext = next.mock.calls[0][0];
    expect(errorPassedToNext.statusCode).toBe(404);
    expect(errorPassedToNext.message).toBe("User not found with id of nonexistentuser123");
  });
});
