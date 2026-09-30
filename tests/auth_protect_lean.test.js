const { protect } = require("../middleware/auth");
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

jest.mock("../models/UserModel");
jest.mock("jsonwebtoken");

describe("Protect Middleware Optimization", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should chain .lean() when querying user and set req.user.id property", async () => {
    const mockUser = {
      _id: "507f1f77bcf86cd799439011",
      name: "John Doe",
      email: "john@example.com",
      role: "user",
    };

    jwt.verify.mockReturnValue({ id: "507f1f77bcf86cd799439011" });

    const mockLean = jest.fn().mockResolvedValue(mockUser);
    User.findById.mockReturnValue({ lean: mockLean });

    const req = {
      headers: { authorization: "Bearer validtoken" },
      cookies: {},
    };
    const res = {};
    const next = jest.fn();

    await protect(req, res, next);

    expect(User.findById).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
    expect(mockLean).toHaveBeenCalled();
    expect(req.user).toEqual({
      ...mockUser,
      id: "507f1f77bcf86cd799439011",
    });
    expect(next).toHaveBeenCalledWith();
  });
});
