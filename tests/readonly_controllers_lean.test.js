const { getBootcamp } = require("../controllers/bootcampsController");
const { getCourse, getCourses } = require("../controllers/coursesController");
const { getReview, getReviews } = require("../controllers/reviewsController");
const { Bootcamp, Course, Review } = require("../models");

jest.mock("../models");

describe("Read-Only Controllers - Mongoose .lean() Optimization", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      params: { id: "123456789012345678901234", bootcampId: "bootcamp123" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("getBootcamp", () => {
    it("should call .lean() when querying bootcamp by id", async () => {
      const mockQuery = {
        lean: jest.fn().mockResolvedValue({
          _id: "123456789012345678901234",
          name: "Test Bootcamp",
        }),
      };
      Bootcamp.findById.mockReturnValue(mockQuery);

      await getBootcamp(req, res, next);

      expect(Bootcamp.findById).toHaveBeenCalledWith(
        "123456789012345678901234",
      );
      expect(mockQuery.lean).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { _id: "123456789012345678901234", name: "Test Bootcamp" },
      });
    });
  });

  describe("getCourse", () => {
    it("should call .lean() when querying course by id", async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        lean: jest
          .fn()
          .mockResolvedValue({ _id: "course123", title: "Test Course" }),
      };
      Course.findById.mockReturnValue(mockQuery);

      await getCourse(req, res, next);

      expect(Course.findById).toHaveBeenCalledWith("123456789012345678901234");
      expect(mockQuery.populate).toHaveBeenCalledWith({
        path: "bootcamp",
        select: "name description",
      });
      expect(mockQuery.lean).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { _id: "course123", title: "Test Course" },
      });
    });
  });

  describe("getCourses by bootcampId", () => {
    it("should call .lean() when querying courses for a bootcamp", async () => {
      const mockQuery = {
        lean: jest
          .fn()
          .mockResolvedValue([{ _id: "course1", title: "Course 1" }]),
      };
      Course.find.mockReturnValue(mockQuery);

      await getCourses(req, res, next);

      expect(Course.find).toHaveBeenCalledWith({ bootcamp: "bootcamp123" });
      expect(mockQuery.lean).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 1,
        data: [{ _id: "course1", title: "Course 1" }],
      });
    });
  });

  describe("getReview", () => {
    it("should call .lean() when querying review by id", async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        lean: jest
          .fn()
          .mockResolvedValue({ _id: "review123", title: "Test Review" }),
      };
      Review.findById.mockReturnValue(mockQuery);

      await getReview(req, res, next);

      expect(Review.findById).toHaveBeenCalledWith("123456789012345678901234");
      expect(mockQuery.populate).toHaveBeenCalledWith({
        path: "bootcamp",
        select: "name description",
      });
      expect(mockQuery.lean).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { _id: "review123", title: "Test Review" },
      });
    });
  });

  describe("getReviews by bootcampId", () => {
    it("should call .lean() when querying reviews for a bootcamp", async () => {
      const mockQuery = {
        lean: jest
          .fn()
          .mockResolvedValue([{ _id: "review1", title: "Review 1" }]),
      };
      Review.find.mockReturnValue(mockQuery);

      await getReviews(req, res, next);

      expect(Review.find).toHaveBeenCalledWith({ bootcamp: "bootcamp123" });
      expect(mockQuery.lean).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 1,
        data: [{ _id: "review1", title: "Review 1" }],
      });
    });
  });
});
