const { updateUser } = require("../controllers/usersController");
const { User } = require("../models");

jest.mock("../models/UserModel");

describe("Admin Self-Demotion Prevention", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { id: "admin123" },
      user: { id: "admin123", role: "admin" },
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should prevent admin from demoting their own role to 'user' or 'publisher'", async () => {
    req.body = { role: "user" };

    await updateUser(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const errorResponse = next.mock.calls[0][0];
    expect(errorResponse.statusCode).toBe(400);
    expect(errorResponse.message).toMatch(
      /Admin cannot demote their own account role/i,
    );
    expect(User.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("should allow admin to update another user's role", async () => {
    req.params.id = "user456";
    req.body = { role: "publisher" };
    User.findByIdAndUpdate.mockResolvedValue({
      _id: "user456",
      role: "publisher",
    });

    await updateUser(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      "user456",
      { role: "publisher" },
      {
        new: true,
        runValidators: true,
      },
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { _id: "user456", role: "publisher" },
    });
  });

  it("should allow admin to update their own non-role fields (e.g., name)", async () => {
    req.body = { name: "New Admin Name" };
    User.findByIdAndUpdate.mockResolvedValue({
      _id: "admin123",
      name: "New Admin Name",
      role: "admin",
    });

    await updateUser(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      "admin123",
      { name: "New Admin Name" },
      {
        new: true,
        runValidators: true,
      },
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
