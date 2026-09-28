const { createUser, updateUser } = require("../controllers/usersController");
const { User } = require("../models");

jest.mock("../models", () => ({
  User: {
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

describe("User Controller - Mass Assignment Security", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    it("should only pass permitted fields to User.create", async () => {
      const createdUser = {
        _id: "user123",
        name: "John Doe",
        email: "john@example.com",
        role: "publisher",
      };

      User.create.mockResolvedValue(createdUser);

      const req = {
        body: {
          name: "John Doe",
          email: "john@example.com",
          password: "password123",
          role: "publisher",
          resetPasswordToken: "malicious_token",
          resetPasswordExpire: Date.now() + 100000,
          isAdmin: true,
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await createUser(req, res, next);

      expect(User.create).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        role: "publisher",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: createdUser,
      });
    });
  });

  describe("updateUser", () => {
    it("should only pass permitted fields to User.findByIdAndUpdate", async () => {
      const updatedUser = {
        _id: "user456",
        name: "Jane Updated",
        email: "jane@example.com",
        role: "user",
      };

      User.findByIdAndUpdate.mockResolvedValue(updatedUser);

      const req = {
        params: { id: "user456" },
        user: { id: "admin123", role: "admin" },
        body: {
          name: "Jane Updated",
          email: "jane@example.com",
          role: "user",
          password: "hackedPassword123",
          resetPasswordToken: "injectedToken",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await updateUser(req, res, next);

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        "user456",
        {
          name: "Jane Updated",
          email: "jane@example.com",
          role: "user",
        },
        {
          new: true,
          runValidators: true,
        },
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: updatedUser,
      });
    });
  });
});
