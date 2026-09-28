const { updateBootcamp } = require("../controllers/bootcampsController");
const { Bootcamp } = require("../models");

jest.mock("../models", () => ({
  Bootcamp: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

describe("Bootcamp Controller - Mass Assignment Security", () => {
  it("should strip user field from req.body when updating a bootcamp", async () => {
    const mockBootcamp = {
      _id: "bootcamp123",
      user: "user123",
      name: "Old Bootcamp Name",
    };

    Bootcamp.findById.mockResolvedValue(mockBootcamp);
    Bootcamp.findByIdAndUpdate.mockResolvedValue({
      ...mockBootcamp,
      name: "Updated Bootcamp Name",
    });

    const req = {
      params: { id: "bootcamp123" },
      user: { id: "user123", role: "publisher" },
      body: {
        name: "Updated Bootcamp Name",
        user: "attacker456", // Attempted ownership transfer / mass assignment
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Call updateBootcamp and await the inner Promise returned by asyncHandler
    await new Promise((resolve) => {
      res.json.mockImplementation(() => resolve());
      next.mockImplementation((err) => resolve(err));
      updateBootcamp(req, res, next);
    });

    expect(Bootcamp.findByIdAndUpdate).toHaveBeenCalledWith(
      "bootcamp123",
      { name: "Updated Bootcamp Name" },
      { new: true, runValidators: true },
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
