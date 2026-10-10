const { updatePassword } = require("../controllers/authController");
const { User } = require("../models");

jest.mock("../models", () => ({
  User: {
    findById: jest.fn(),
  },
}));

describe("authController.updatePassword - Security null check", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: { id: "5f7d1b2e3c4d5e6f7a8b9c0d" },
      body: {
        currentPassword: "OldPassword123!",
        newPassword: "NewPassword123!",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  test("should return 404 ErrorResponse when user is not found in database", async () => {
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    await updatePassword(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe("User not found");
  });
});
