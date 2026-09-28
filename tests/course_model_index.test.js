const CourseModel = require("../models/CourseModel");
const { getCourses, getCourse } = require("../controllers/coursesController");
const { getReviews, getReview } = require("../controllers/reviewsController");
const { Course, Review } = require("../models");

jest.mock("../middleware", () => ({
  asyncHandler: (fn) => (req, res, next) => fn(req, res, next),
}));

describe("Course & Review Optimizations", () => {
  it("should have index: true configured on bootcamp and user fields in actual Course schema", () => {
    const bootcampPath = CourseModel.schema.path("bootcamp");
    const userPath = CourseModel.schema.path("user");

    expect(bootcampPath.options.index).toBe(true);
    expect(userPath.options.index).toBe(true);
  });

  it("should chain .lean() in getCourses when filtered by bootcampId", async () => {
    const mockLean = jest.fn().mockResolvedValue([{ id: "course1" }]);
    const spy = jest.spyOn(Course, "find").mockReturnValue({ lean: mockLean });

    const req = { params: { bootcampId: "bootcamp123" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await getCourses(req, res, next);

    expect(Course.find).toHaveBeenCalledWith({ bootcamp: "bootcamp123" });
    expect(mockLean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      count: 1,
      data: [{ id: "course1" }],
    });

    spy.mockRestore();
  });

  it("should chain .lean() in getCourse", async () => {
    const mockLean = jest.fn().mockResolvedValue({ id: "course1", title: "Test" });
    const mockPopulate = jest.fn().mockReturnValue({ lean: mockLean });
    const spy = jest.spyOn(Course, "findById").mockReturnValue({ populate: mockPopulate });

    const req = { params: { id: "course1" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await getCourse(req, res, next);

    expect(Course.findById).toHaveBeenCalledWith("course1");
    expect(mockPopulate).toHaveBeenCalled();
    expect(mockLean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);

    spy.mockRestore();
  });

  it("should chain .lean() in getReviews when filtered by bootcampId", async () => {
    const mockLean = jest.fn().mockResolvedValue([{ id: "review1" }]);
    const spy = jest.spyOn(Review, "find").mockReturnValue({ lean: mockLean });

    const req = { params: { bootcampId: "bootcamp123" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await getReviews(req, res, next);

    expect(Review.find).toHaveBeenCalledWith({ bootcamp: "bootcamp123" });
    expect(mockLean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);

    spy.mockRestore();
  });

  it("should chain .lean() in getReview", async () => {
    const mockLean = jest.fn().mockResolvedValue({ id: "review1", title: "Test" });
    const mockPopulate = jest.fn().mockReturnValue({ lean: mockLean });
    const spy = jest.spyOn(Review, "findById").mockReturnValue({ populate: mockPopulate });

    const req = { params: { id: "review1" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await getReview(req, res, next);

    expect(Review.findById).toHaveBeenCalledWith("review1");
    expect(mockPopulate).toHaveBeenCalled();
    expect(mockLean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);

    spy.mockRestore();
  });
});
