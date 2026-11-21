const { updateBootcamp, bootcampPhotoUpload } = require("../controllers/bootcampsController");
const { updateCourse } = require("../controllers/coursesController");
const { updateReview } = require("../controllers/reviewsController");
const { Bootcamp, Course, Review } = require("../models");

jest.mock("../middleware", () => ({
  asyncHandler: (fn) => (req, res, next) => fn(req, res, next),
}));

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

describe("Update Controllers - Mongoose .select('user').lean() Optimization", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { id: "123456789012345678901234" },
      user: { id: "user123", role: "publisher" },
      body: { name: "Updated Name" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("updateBootcamp", () => {
    it("should chain .select('user').lean() on Bootcamp.findById query", async () => {
      const mockLean = jest.fn().mockResolvedValue({
        _id: "123456789012345678901234",
        user: "user123",
      });
      const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
      Bootcamp.findById.mockReturnValue({ select: mockSelect });
      Bootcamp.findByIdAndUpdate.mockResolvedValue({
        _id: "123456789012345678901234",
        name: "Updated Name",
      });

      await updateBootcamp(req, res, next);

      expect(Bootcamp.findById).toHaveBeenCalledWith("123456789012345678901234");
      expect(mockSelect).toHaveBeenCalledWith("user");
      expect(mockLean).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("updateCourse", () => {
    it("should chain .select('user').lean() on Course.findById query", async () => {
      const mockLean = jest.fn().mockResolvedValue({
        _id: "123456789012345678901234",
        user: "user123",
      });
      const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
      Course.findById.mockReturnValue({ select: mockSelect });
      Course.findByIdAndUpdate.mockResolvedValue({
        _id: "123456789012345678901234",
        title: "Updated Course",
      });

      await updateCourse(req, res, next);

      expect(Course.findById).toHaveBeenCalledWith("123456789012345678901234");
      expect(mockSelect).toHaveBeenCalledWith("user");
      expect(mockLean).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("updateReview", () => {
    it("should chain .select('user').lean() on Review.findById query", async () => {
      const mockLean = jest.fn().mockResolvedValue({
        _id: "123456789012345678901234",
        user: "user123",
      });
      const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
      Review.findById.mockReturnValue({ select: mockSelect });
      Review.findByIdAndUpdate.mockResolvedValue({
        _id: "123456789012345678901234",
        title: "Updated Review",
      });

      await updateReview(req, res, next);

      expect(Review.findById).toHaveBeenCalledWith("123456789012345678901234");
      expect(mockSelect).toHaveBeenCalledWith("user");
      expect(mockLean).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("bootcampPhotoUpload", () => {
    it("should chain .select('user').lean() on Bootcamp.findById query", async () => {
      const mockLean = jest.fn().mockResolvedValue({
        _id: "123456789012345678901234",
        user: "user123",
      });
      const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
      Bootcamp.findById.mockReturnValue({ select: mockSelect });

      req.files = {
        file: {
          name: "photo.jpg",
          mimetype: "image/jpeg",
          size: 500000,
          mv: jest.fn().mockImplementation((path, cb) => cb(null)),
        },
      };

      await bootcampPhotoUpload(req, res, next);

      expect(Bootcamp.findById).toHaveBeenCalledWith("123456789012345678901234");
      expect(mockSelect).toHaveBeenCalledWith("user");
      expect(mockLean).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
