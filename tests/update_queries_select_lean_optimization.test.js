const {
  updateBootcamp,
  bootcampPhotoUpload,
} = require("../controllers/bootcampsController");
const { updateCourse } = require("../controllers/coursesController");
const { updateReview } = require("../controllers/reviewsController");
const { Bootcamp, Course, Review } = require("../models");

jest.mock("../models");
jest.mock("../middleware", () => ({
  asyncHandler: (fn) => (req, res, next) => fn(req, res, next),
}));

describe("Pre-Update Authorization Query Optimizations", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { id: "res123" },
      user: { id: "user123", role: "publisher" },
      body: { name: "Updated Name" },
      files: {
        file: {
          name: "photo.jpg",
          mimetype: "image/jpeg",
          size: 1000,
          mv: jest.fn((path, cb) => cb(null)),
        },
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should chain .select('user').lean() when querying bootcamp in updateBootcamp", async () => {
    const mockLean = jest
      .fn()
      .mockResolvedValue({ _id: "res123", user: "user123" });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    Bootcamp.findById.mockReturnValue({ select: mockSelect });
    Bootcamp.findByIdAndUpdate.mockResolvedValue({
      _id: "res123",
      name: "Updated Name",
    });

    await updateBootcamp(req, res, next);

    expect(Bootcamp.findById).toHaveBeenCalledWith("res123");
    expect(mockSelect).toHaveBeenCalledWith("user");
    expect(mockLean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should chain .select('user').lean() when querying bootcamp in bootcampPhotoUpload", async () => {
    const mockLean = jest
      .fn()
      .mockResolvedValue({ _id: "res123", user: "user123" });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    Bootcamp.findById.mockReturnValue({ select: mockSelect });
    Bootcamp.findByIdAndUpdate.mockResolvedValue({
      _id: "res123",
      photo: "photo_res123.jpg",
    });

    await bootcampPhotoUpload(req, res, next);

    expect(Bootcamp.findById).toHaveBeenCalledWith("res123");
    expect(mockSelect).toHaveBeenCalledWith("user");
    expect(mockLean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should chain .select('user').lean() when querying course in updateCourse", async () => {
    const mockLean = jest
      .fn()
      .mockResolvedValue({ _id: "res123", user: "user123" });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    Course.findById.mockReturnValue({ select: mockSelect });
    Course.findByIdAndUpdate.mockResolvedValue({
      _id: "res123",
      title: "Updated Course",
    });

    await updateCourse(req, res, next);

    expect(Course.findById).toHaveBeenCalledWith("res123");
    expect(mockSelect).toHaveBeenCalledWith("user");
    expect(mockLean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should chain .select('user').lean() when querying review in updateReview", async () => {
    const mockLean = jest
      .fn()
      .mockResolvedValue({ _id: "res123", user: "user123" });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    Review.findById.mockReturnValue({ select: mockSelect });
    Review.findByIdAndUpdate.mockResolvedValue({
      _id: "res123",
      title: "Updated Review",
    });

    await updateReview(req, res, next);

    expect(Review.findById).toHaveBeenCalledWith("res123");
    expect(mockSelect).toHaveBeenCalledWith("user");
    expect(mockLean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
