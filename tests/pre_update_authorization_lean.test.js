const { Bootcamp, Course, Review } = require("../models");

jest.mock("../models", () => ({
  Bootcamp: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
  Course: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
  Review: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

const {
  updateBootcamp,
  bootcampPhotoUpload,
} = require("../controllers/bootcampsController");
const { updateCourse } = require("../controllers/coursesController");
const { updateReview } = require("../controllers/reviewsController");

describe("Pre-Update Authorization Optimization (.select('user').lean())", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { id: "60d5ec49f1b2c80015f8e001" },
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

  it("should chain .select('user').lean() on Bootcamp.findById in updateBootcamp", async () => {
    const mockLean = jest
      .fn()
      .mockResolvedValue({ _id: "60d5ec49f1b2c80015f8e001", user: "user123" });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    Bootcamp.findById.mockReturnValue({ select: mockSelect });
    Bootcamp.findByIdAndUpdate.mockResolvedValue({
      _id: "60d5ec49f1b2c80015f8e001",
      name: "Updated Name",
    });

    updateBootcamp(req, res, next);
    await new Promise(setImmediate);

    expect(Bootcamp.findById).toHaveBeenCalledWith("60d5ec49f1b2c80015f8e001");
    expect(mockSelect).toHaveBeenCalledWith("user");
    expect(mockLean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should chain .select('user').lean() on Bootcamp.findById in bootcampPhotoUpload", async () => {
    const mockLean = jest
      .fn()
      .mockResolvedValue({ _id: "60d5ec49f1b2c80015f8e001", user: "user123" });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    Bootcamp.findById.mockReturnValue({ select: mockSelect });
    Bootcamp.findByIdAndUpdate.mockResolvedValue({});

    bootcampPhotoUpload(req, res, next);
    await new Promise(setImmediate);

    expect(Bootcamp.findById).toHaveBeenCalledWith("60d5ec49f1b2c80015f8e001");
    expect(mockSelect).toHaveBeenCalledWith("user");
    expect(mockLean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should chain .select('user').lean() on Course.findById in updateCourse", async () => {
    const mockLean = jest
      .fn()
      .mockResolvedValue({ _id: "60d5ec49f1b2c80015f8e001", user: "user123" });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    Course.findById.mockReturnValue({ select: mockSelect });
    Course.findByIdAndUpdate.mockResolvedValue({
      _id: "60d5ec49f1b2c80015f8e001",
      title: "Updated Course Title",
    });

    updateCourse(req, res, next);
    await new Promise(setImmediate);

    expect(Course.findById).toHaveBeenCalledWith("60d5ec49f1b2c80015f8e001");
    expect(mockSelect).toHaveBeenCalledWith("user");
    expect(mockLean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should chain .select('user').lean() on Review.findById in updateReview", async () => {
    const mockLean = jest
      .fn()
      .mockResolvedValue({ _id: "60d5ec49f1b2c80015f8e001", user: "user123" });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    Review.findById.mockReturnValue({ select: mockSelect });
    Review.findByIdAndUpdate.mockResolvedValue({
      _id: "60d5ec49f1b2c80015f8e001",
      title: "Updated Review Title",
    });

    updateReview(req, res, next);
    await new Promise(setImmediate);

    expect(Review.findById).toHaveBeenCalledWith("60d5ec49f1b2c80015f8e001");
    expect(mockSelect).toHaveBeenCalledWith("user");
    expect(mockLean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
