const { updatePassword, getMe, updateDetails } = require("../controllers/authController");
const { User } = require("../models");

jest.mock("../models", () => ({
  User: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

describe("Auth Controller - Missing User Document Validation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a 404 ErrorResponse when User.findById returns null in updatePassword", async () => {
    const mockSelect = jest.fn().mockResolvedValue(null);
    User.findById.mockReturnValue({
      select: mockSelect,
    });

    const req = {
      user: { id: "nonexistentuser123" },
      body: {
        currentPassword: "OldPassword123!",
        newPassword: "NewPassword123!",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await updatePassword(req, res, next);

    expect(User.findById).toHaveBeenCalledWith("nonexistentuser123");
    expect(mockSelect).toHaveBeenCalledWith("+password");
    expect(next).toHaveBeenCalledTimes(1);
    const errorResponse = next.mock.calls[0][0];
    expect(errorResponse.statusCode).toBe(404);
    expect(errorResponse.message).toBe("User not found");
  });

  it("should return a 404 ErrorResponse when User.findById returns null in getMe", async () => {
    const mockLean = jest.fn().mockResolvedValue(null);
    User.findById.mockReturnValue({
      lean: mockLean,
    });

    const req = {
      user: { id: "nonexistentuser123" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await getMe(req, res, next);

    expect(User.findById).toHaveBeenCalledWith("nonexistentuser123");
    expect(mockLean).toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    const errorResponse = next.mock.calls[0][0];
    expect(errorResponse.statusCode).toBe(404);
    expect(errorResponse.message).toBe("User not found");
  });

  it("should return a 404 ErrorResponse when User.findByIdAndUpdate returns null in updateDetails", async () => {
    User.findByIdAndUpdate.mockResolvedValue(null);

    const req = {
      user: { id: "nonexistentuser123" },
      body: {
        name: "New Name",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await updateDetails(req, res, next);

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      "nonexistentuser123",
      { name: "New Name" },
      { new: true, runValidators: true }
    );
    expect(next).toHaveBeenCalledTimes(1);
    const errorResponse = next.mock.calls[0][0];
    expect(errorResponse.statusCode).toBe(404);
    expect(errorResponse.message).toBe("User not found");
  });
});
