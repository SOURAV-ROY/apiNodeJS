const { updateDetails } = require("../controllers/authController");
const { User } = require("../models");

jest.mock("../models", () => ({
  User: {
    findByIdAndUpdate: jest.fn(),
  },
}));

describe("Auth Controller - updateDetails Security", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should only pass defined permitted fields (name and email) to findByIdAndUpdate", async () => {
    User.findByIdAndUpdate.mockResolvedValue({
      _id: "user123",
      name: "Existing Name",
      email: "newemail@example.com",
    });

    const req = {
      user: { id: "user123" },
      body: {
        email: "newemail@example.com",
        role: "admin", // Attempted privilege escalation / mass assignment
        password: "newpassword123", // Attempted unauthorized password override
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await updateDetails(req, res, next);

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      "user123",
      { email: "newemail@example.com" },
      { new: true, runValidators: true },
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should not include undefined properties when updating only name", async () => {
    User.findByIdAndUpdate.mockResolvedValue({
      _id: "user123",
      name: "New Name",
      email: "existing@example.com",
    });

    const req = {
      user: { id: "user123" },
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
      "user123",
      { name: "New Name" },
      { new: true, runValidators: true },
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
