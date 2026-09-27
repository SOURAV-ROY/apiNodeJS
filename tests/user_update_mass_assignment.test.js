const { updateUser } = require("../controllers/usersController");
const { User } = require("../models");

jest.mock("../models", () => ({
  User: {
    findByIdAndUpdate: jest.fn(),
  },
}));

describe("User Controller - Mass Assignment Security", () => {
  it("should whitelist allowed fields (name, email, role) when updating a user", async () => {
    const mockUser = {
      _id: "user123",
      name: "Updated Name",
      email: "updated@example.com",
      role: "publisher",
    };

    User.findByIdAndUpdate.mockResolvedValue(mockUser);

    const req = {
      params: { id: "user123" },
      user: { id: "admin999", role: "admin" },
      body: {
        name: "Updated Name",
        email: "updated@example.com",
        role: "publisher",
        password: "hackedPassword123", // Attempted mass assignment override
        resetPasswordToken: "forbiddenToken", // Attempted sensitive field override
        _id: "hackedId", // Attempted ID modification
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await new Promise((resolve) => {
      res.json.mockImplementation(() => resolve());
      next.mockImplementation((err) => resolve(err));
      updateUser(req, res, next);
    });

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      "user123",
      {
        name: "Updated Name",
        email: "updated@example.com",
        role: "publisher",
      },
      { new: true, runValidators: true },
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
