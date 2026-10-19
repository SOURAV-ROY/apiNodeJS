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

describe("Pre-update authorization query optimization", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { id: "123456789012345678901234" },
      user: { id: "user123", role: "publisher", name: "Test User" },
      body: { name: "Updated Name" },
      files: {
        file: {
          name: "test.jpg",
          mimetype: "image/jpeg",
          size: 100,
          mv: jest.fn(),
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
      .mockResolvedValue({ _id: "123456789012345678901234", user: "user123" });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    Bootcamp.findById.mockReturnValue({ select: mockSelect });
    Bootcamp.findByIdAndUpdate.mockResolvedValue({
      _id: "123456789012345678901234",
      name: "Updated Name",
    });

    updateBootcamp(req, res, next);
    await new Promise(setImmediate);

    expect(Bootcamp.findById).toHaveBeenCalledWith("123456789012345678901234");
    expect(mockSelect).toHaveBeenCalledWith("user");
    expect(mockLean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should chain .select('user').lean() on Bootcamp.findById in bootcampPhotoUpload", async () => {
    const mockLean = jest
      .fn()
      .mockResolvedValue({ _id: "123456789012345678901234", user: "user123" });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    Bootcamp.findById.mockReturnValue({ select: mockSelect });

    bootcampPhotoUpload(req, res, next);
    await new Promise(setImmediate);

    expect(Bootcamp.findById).toHaveBeenCalledWith("123456789012345678901234");
    expect(mockSelect).toHaveBeenCalledWith("user");
    expect(mockLean).toHaveBeenCalled();
  });

  it("should chain .select('user').lean() on Course.findById in updateCourse", async () => {
    const mockLean = jest
      .fn()
      .mockResolvedValue({ _id: "123456789012345678901234", user: "user123" });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    Course.findById.mockReturnValue({ select: mockSelect });
    Course.findByIdAndUpdate.mockResolvedValue({
      _id: "123456789012345678901234",
      title: "Updated Course Title",
    });

    updateCourse(req, res, next);
    await new Promise(setImmediate);

    expect(Course.findById).toHaveBeenCalledWith("123456789012345678901234");
    expect(mockSelect).toHaveBeenCalledWith("user");
    expect(mockLean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should chain .select('user').lean() on Review.findById in updateReview", async () => {
    const mockLean = jest
      .fn()
      .mockResolvedValue({ _id: "123456789012345678901234", user: "user123" });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    Review.findById.mockReturnValue({ select: mockSelect });
    Review.findByIdAndUpdate.mockResolvedValue({
      _id: "123456789012345678901234",
      title: "Updated Review Title",
    });

    updateReview(req, res, next);
    await new Promise(setImmediate);

    expect(Review.findById).toHaveBeenCalledWith("123456789012345678901234");
    expect(mockSelect).toHaveBeenCalledWith("user");
    expect(mockLean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
