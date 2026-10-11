const { getMe } = require("../controllers/authController");
const { User } = require("../models");

jest.mock("../models", () => ({
  User: {
    findById: jest.fn(),
  },
}));

describe("authController.getMe .lean() optimization", () => {
  it("should chain .lean() when fetching user profile in getMe", async () => {
    const mockUser = {
      _id: "user123",
      name: "John Doe",
      email: "john@example.com",
    };

    const mockLean = jest.fn().mockResolvedValue(mockUser);
    User.findById.mockReturnValue({
      lean: mockLean,
    });

    const req = { user: { id: "user123" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await getMe(req, res, next);

    expect(User.findById).toHaveBeenCalledWith("user123");
    expect(mockLean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockUser,
    });
  });
});
