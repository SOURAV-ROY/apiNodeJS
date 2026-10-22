const { updateBootcamp, bootcampPhotoUpload } = require("../controllers/bootcampsController");
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

describe("Pre-update Ownership Query Projection and Lean Optimizations", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { id: "507f1f77bcf86cd799439011" },
      user: { id: "user123", role: "publisher", name: "Test Owner" },
      body: { name: "Updated Title" },
      files: {
        file: {
          name: "test.jpg",
          mimetype: "image/jpeg",
          size: 100,
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

  it("updateBootcamp should chain .select('user').lean() on pre-update lookup", async () => {
    const mockLean = jest.fn().mockResolvedValue({
      _id: "507f1f77bcf86cd799439011",
      user: "user123",
    });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    Bootcamp.findById.mockReturnValue({ select: mockSelect });
    Bootcamp.findByIdAndUpdate.mockResolvedValue({
      _id: "507f1f77bcf86cd799439011",
      name: "Updated Title",
    });

    await new Promise((resolve) => {
      res.json.mockImplementation(() => resolve());
      next.mockImplementation((err) => resolve(err));
      updateBootcamp(req, res, next);
    });

    expect(Bootcamp.findById).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
    expect(mockSelect).toHaveBeenCalledWith("user");
    expect(mockLean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("bootcampPhotoUpload should chain .select('user').lean() on pre-update lookup", async () => {
    const mockLean = jest.fn().mockResolvedValue({
      _id: "507f1f77bcf86cd799439011",
      user: "user123",
    });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    Bootcamp.findById.mockReturnValue({ select: mockSelect });
    Bootcamp.findByIdAndUpdate.mockResolvedValue({});

    await new Promise((resolve) => {
      res.json.mockImplementation(() => resolve());
      next.mockImplementation((err) => resolve(err));
      bootcampPhotoUpload(req, res, next);
    });

    expect(Bootcamp.findById).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
    expect(mockSelect).toHaveBeenCalledWith("user");
    expect(mockLean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("updateCourse should chain .select('user').lean() on pre-update lookup", async () => {
    const mockLean = jest.fn().mockResolvedValue({
      _id: "507f1f77bcf86cd799439011",
      user: "user123",
    });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    Course.findById.mockReturnValue({ select: mockSelect });
    Course.findByIdAndUpdate.mockResolvedValue({
      _id: "507f1f77bcf86cd799439011",
      title: "Updated Title",
    });

    await new Promise((resolve) => {
      res.json.mockImplementation(() => resolve());
      next.mockImplementation((err) => resolve(err));
      updateCourse(req, res, next);
    });

    expect(Course.findById).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
    expect(mockSelect).toHaveBeenCalledWith("user");
    expect(mockLean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("updateReview should chain .select('user').lean() on pre-update lookup", async () => {
    const mockLean = jest.fn().mockResolvedValue({
      _id: "507f1f77bcf86cd799439011",
      user: "user123",
    });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    Review.findById.mockReturnValue({ select: mockSelect });
    Review.findByIdAndUpdate.mockResolvedValue({
      _id: "507f1f77bcf86cd799439011",
      title: "Updated Title",
    });

    await new Promise((resolve) => {
      res.json.mockImplementation(() => resolve());
      next.mockImplementation((err) => resolve(err));
      updateReview(req, res, next);
    });

    expect(Review.findById).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
    expect(mockSelect).toHaveBeenCalledWith("user");
    expect(mockLean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
