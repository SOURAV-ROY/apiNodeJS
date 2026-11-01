const { updateBootcamp, bootcampPhotoUpload } = require("../controllers/bootcampsController");
const { updateCourse } = require("../controllers/coursesController");
const { updateReview } = require("../controllers/reviewsController");
const { Bootcamp, Course, Review } = require("../models");

jest.mock("../middleware", () => ({
  asyncHandler: (fn) => (req, res, next) => fn(req, res, next),
}));

describe("Pre-update authorization query performance optimizations (.select('user').lean())", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { id: "test-id-123" },
      user: { id: "user-123", role: "publisher" },
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("updateBootcamp", () => {
    it("should chain .select('user').lean() on findById during pre-update authorization check", async () => {
      const mockLean = jest.fn().mockResolvedValue({ _id: "test-id-123", user: "user-123" });
      const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
      jest.spyOn(Bootcamp, "findById").mockReturnValue({ select: mockSelect });
      jest.spyOn(Bootcamp, "findByIdAndUpdate").mockResolvedValue({ _id: "test-id-123", name: "Updated Bootcamp" });

      await updateBootcamp(req, res, next);

      expect(Bootcamp.findById).toHaveBeenCalledWith("test-id-123");
      expect(mockSelect).toHaveBeenCalledWith("user");
      expect(mockLean).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("bootcampPhotoUpload", () => {
    it("should chain .select('user').lean() on findById during pre-upload authorization check", async () => {
      const mockLean = jest.fn().mockResolvedValue({ _id: "test-id-123", user: "user-123" });
      const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
      jest.spyOn(Bootcamp, "findById").mockReturnValue({ select: mockSelect });

      req.files = {
        file: {
          name: "photo.jpg",
          mimetype: "image/jpeg",
          size: 100,
          mv: jest.fn().mockImplementation((path, cb) => cb(null)),
        },
      };

      jest.spyOn(Bootcamp, "findByIdAndUpdate").mockResolvedValue({});

      await bootcampPhotoUpload(req, res, next);

      expect(Bootcamp.findById).toHaveBeenCalledWith("test-id-123");
      expect(mockSelect).toHaveBeenCalledWith("user");
      expect(mockLean).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("updateCourse", () => {
    it("should chain .select('user').lean() on findById during pre-update authorization check", async () => {
      const mockLean = jest.fn().mockResolvedValue({ _id: "test-id-123", user: "user-123" });
      const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
      jest.spyOn(Course, "findById").mockReturnValue({ select: mockSelect });
      jest.spyOn(Course, "findByIdAndUpdate").mockResolvedValue({ _id: "test-id-123", title: "Updated Course" });

      await updateCourse(req, res, next);

      expect(Course.findById).toHaveBeenCalledWith("test-id-123");
      expect(mockSelect).toHaveBeenCalledWith("user");
      expect(mockLean).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("updateReview", () => {
    it("should chain .select('user').lean() on findById during pre-update authorization check", async () => {
      const mockLean = jest.fn().mockResolvedValue({ _id: "test-id-123", user: "user-123" });
      const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
      jest.spyOn(Review, "findById").mockReturnValue({ select: mockSelect });
      jest.spyOn(Review, "findByIdAndUpdate").mockResolvedValue({ _id: "test-id-123", title: "Updated Review" });

      await updateReview(req, res, next);

      expect(Review.findById).toHaveBeenCalledWith("test-id-123");
      expect(mockSelect).toHaveBeenCalledWith("user");
      expect(mockLean).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
