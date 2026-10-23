const {
  updateBootcamp,
  bootcampPhotoUpload,
} = require("../controllers/bootcampsController");
const { Bootcamp } = require("../models");

jest.mock("../models", () => ({
  Bootcamp: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

describe("Bootcamp Pre-Update Projection & Lean Optimization", () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      params: { id: "507f1f77bcf86cd799439011" },
      body: { name: "Updated Bootcamp" },
      user: { id: "507f1f77bcf86cd799439012", role: "publisher" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should chain .select('user').lean() in updateBootcamp before authorization check", async () => {
    const mockLean = jest.fn().mockResolvedValue({
      _id: "507f1f77bcf86cd799439011",
      user: "507f1f77bcf86cd799439012",
    });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    Bootcamp.findById.mockReturnValue({ select: mockSelect });
    Bootcamp.findByIdAndUpdate.mockResolvedValue({
      _id: "507f1f77bcf86cd799439011",
      name: "Updated Bootcamp",
    });

    await updateBootcamp(req, res, next);

    if (next.mock.calls.length > 0) {
      console.log("NEXT ERROR:", next.mock.calls[0][0]);
    }

    expect(Bootcamp.findById).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
    expect(mockSelect).toHaveBeenCalledWith("user");
    expect(mockLean).toHaveBeenCalled();
  });

  it("should chain .select('user').lean() in bootcampPhotoUpload before authorization check", async () => {
    req.files = {
      file: {
        name: "test.jpg",
        mimetype: "image/jpeg",
        size: 1000,
        mv: jest.fn().mockImplementation((path, cb) => cb(null)),
      },
    };

    const mockLean = jest.fn().mockResolvedValue({
      _id: "507f1f77bcf86cd799439011",
      user: "507f1f77bcf86cd799439012",
    });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    Bootcamp.findById.mockReturnValue({ select: mockSelect });
    Bootcamp.findByIdAndUpdate.mockResolvedValue({});

    await bootcampPhotoUpload(req, res, next);

    expect(Bootcamp.findById).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
    expect(mockSelect).toHaveBeenCalledWith("user");
    expect(mockLean).toHaveBeenCalled();
  });
});
