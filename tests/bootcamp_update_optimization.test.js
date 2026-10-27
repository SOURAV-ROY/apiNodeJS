const { updateBootcamp } = require("../controllers/bootcampsController");
const { Bootcamp } = require("../models");

jest.mock("../middleware", () => ({
  asyncHandler: (fn) => (req, res, next) => fn(req, res, next),
}));

describe("updateBootcamp Optimization & Security", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should chain .select('user').lean() on Bootcamp.findById when updating a bootcamp", async () => {
    const mockLean = jest
      .fn()
      .mockResolvedValue({ _id: "b1", user: "user123" });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    jest.spyOn(Bootcamp, "findById").mockReturnValue({ select: mockSelect });

    const updatedBootcamp = {
      _id: "b1",
      name: "Updated Name",
      user: "user123",
    };
    jest
      .spyOn(Bootcamp, "findByIdAndUpdate")
      .mockResolvedValue(updatedBootcamp);

    const req = {
      params: { id: "b1" },
      user: { id: "user123", role: "publisher" },
      body: { name: "Updated Name", user: "attackerId" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await updateBootcamp(req, res, next);

    expect(Bootcamp.findById).toHaveBeenCalledWith("b1");
    expect(mockSelect).toHaveBeenCalledWith("user");
    expect(mockLean).toHaveBeenCalled();
    expect(req.body.user).toBeUndefined();
    expect(Bootcamp.findByIdAndUpdate).toHaveBeenCalledWith(
      "b1",
      { name: "Updated Name" },
      { new: true, runValidators: true },
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: updatedBootcamp,
    });
  });
});
