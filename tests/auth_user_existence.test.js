const { getMe, updateDetails } = require("../controllers/authController");
const { User } = require("../models");
const ErrorResponse = require("../utils/ErrorResponse");

jest.mock("../models", () => ({
  User: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

describe("authController User Existence Checks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getMe should pass a 404 ErrorResponse to next when user is not found", async () => {
    User.findById.mockReturnValue({
      lean: jest.fn().mockResolvedValue(null),
    });

    const req = { user: { id: "nonexistent_user_id" } };
    const res = {};
    const next = jest.fn();

    await getMe(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ErrorResponse));
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(404);
    expect(error.message).toContain("User not found");
  });

  it("updateDetails should pass a 404 ErrorResponse to next when user is not found", async () => {
    User.findByIdAndUpdate.mockResolvedValue(null);

    const req = {
      user: { id: "nonexistent_user_id" },
      body: { name: "Updated Name" },
    };
    const res = {};
    const next = jest.fn();

    await updateDetails(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ErrorResponse));
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(404);
    expect(error.message).toContain("User not found");
  });
});
