const { getMe, updateDetails } = require("../controllers/authController");
const { User } = require("../models");
const ErrorResponse = require("../utils/ErrorResponse");

jest.mock("../models", () => ({
  User: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

describe("authController - Missing User Security Checks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getMe", () => {
    it("should return a 404 ErrorResponse when user is not found in getMe", async () => {
      const mockQuery = {
        lean: jest.fn().mockResolvedValue(null),
      };
      User.findById.mockReturnValue(mockQuery);

      const req = { user: { id: "missinguser123" } };
      const res = {};
      const next = jest.fn();

      await getMe(req, res, next);

      expect(User.findById).toHaveBeenCalledWith("missinguser123");
      expect(mockQuery.lean).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expect.any(ErrorResponse));

      const err = next.mock.calls[0][0];
      expect(err.statusCode).toBe(404);
      expect(err.message).toBe("User not found with id of missinguser123");
    });
  });

  describe("updateDetails", () => {
    it("should return a 404 ErrorResponse when user is not found in updateDetails", async () => {
      User.findByIdAndUpdate.mockResolvedValue(null);

      const req = {
        user: { id: "missinguser123" },
        body: { name: "New Name" },
      };
      const res = {};
      const next = jest.fn();

      await updateDetails(req, res, next);

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        "missinguser123",
        { name: "New Name" },
        { new: true, runValidators: true },
      );
      expect(next).toHaveBeenCalledWith(expect.any(ErrorResponse));

      const err = next.mock.calls[0][0];
      expect(err.statusCode).toBe(404);
      expect(err.message).toBe("User not found with id of missinguser123");
    });
  });
});
