const {
  updateBootcamp,
  bootcampPhotoUpload,
} = require("../controllers/bootcampsController");
const { updateCourse } = require("../controllers/coursesController");
const { updateReview } = require("../controllers/reviewsController");
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

describe("Pre-Update Authorization Query Optimization (.select('user').lean())", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { id: "60d5ec49f1b2c80015f8e001" },
      user: { id: "user123", role: "publisher" },
      body: { name: "Updated Title" },
      files: { file: { mimetype: "image/jpeg", name: "test.jpg", size: 100, mv: jest.fn() } },
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

  it("updateBootcamp should chain .select('user').lean() on findById", async () => {
    const mockLean = jest.fn().mockResolvedValue({ _id: "60d5ec49f1b2c80015f8e001", user: "user123" });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    Bootcamp.findById.mockReturnValue({ select: mockSelect });
    Bootcamp.findByIdAndUpdate.mockResolvedValue({ _id: "60d5ec49f1b2c80015f8e001", name: "Updated Title" });

    updateBootcamp(req, res, next);
    await new Promise(setImmediate);

    expect(Bootcamp.findById).toHaveBeenCalledWith("60d5ec49f1b2c80015f8e001");
    expect(mockSelect).toHaveBeenCalledWith("user");
    expect(mockLean).toHaveBeenCalled();
  });

  it("bootcampPhotoUpload should chain .select('user').lean() on findById", async () => {
    const mockLean = jest.fn().mockResolvedValue({ _id: "60d5ec49f1b2c80015f8e001", user: "user123" });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    Bootcamp.findById.mockReturnValue({ select: mockSelect });

    bootcampPhotoUpload(req, res, next);
    await new Promise(setImmediate);

    expect(Bootcamp.findById).toHaveBeenCalledWith("60d5ec49f1b2c80015f8e001");
    expect(mockSelect).toHaveBeenCalledWith("user");
    expect(mockLean).toHaveBeenCalled();
  });

  it("updateCourse should chain .select('user').lean() on findById", async () => {
    const mockLean = jest.fn().mockResolvedValue({ _id: "60d5ec49f1b2c80015f8e001", user: "user123" });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    Course.findById.mockReturnValue({ select: mockSelect });
    Course.findByIdAndUpdate.mockResolvedValue({ _id: "60d5ec49f1b2c80015f8e001", name: "Updated Title" });

    updateCourse(req, res, next);
    await new Promise(setImmediate);

    expect(Course.findById).toHaveBeenCalledWith("60d5ec49f1b2c80015f8e001");
    expect(mockSelect).toHaveBeenCalledWith("user");
    expect(mockLean).toHaveBeenCalled();
  });

  it("updateReview should chain .select('user').lean() on findById", async () => {
    const mockLean = jest.fn().mockResolvedValue({ _id: "60d5ec49f1b2c80015f8e001", user: "user123" });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    Review.findById.mockReturnValue({ select: mockSelect });
    Review.findByIdAndUpdate.mockResolvedValue({ _id: "60d5ec49f1b2c80015f8e001", name: "Updated Title" });

    updateReview(req, res, next);
    await new Promise(setImmediate);

    expect(Review.findById).toHaveBeenCalledWith("60d5ec49f1b2c80015f8e001");
    expect(mockSelect).toHaveBeenCalledWith("user");
    expect(mockLean).toHaveBeenCalled();
  });
});
