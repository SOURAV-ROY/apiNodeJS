const { Course, Bootcamp, Review } = require("../models");

jest.mock("../models", () => ({
  Course: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
  Bootcamp: {
    findById: jest.fn(),
  },
  Review: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

const {
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/coursesController");
const {
  updateReview,
  deleteReview,
} = require("../controllers/reviewsController");

describe("Course and Review Ownership Authorization Safety", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { id: "course123", bootcampId: "bootcamp123" },
      user: { id: "user123", role: "publisher", name: "Test User" },
      body: { title: "Updated Title" },
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

  describe("addCourse", () => {
    it("should return 401 when bootcamp user is undefined", async () => {
      Bootcamp.findById.mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue({
            _id: "bootcamp123",
            user: undefined,
          }),
        }),
      });

      addCourse(req, res, next);
      await new Promise(setImmediate);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 401,
        }),
      );
    });
  });

  describe("updateCourse", () => {
    it("should return 401 when course user is undefined", async () => {
      Course.findById.mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue({
            _id: "course123",
            user: undefined,
          }),
        }),
      });

      updateCourse(req, res, next);
      await new Promise(setImmediate);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 401,
        }),
      );
    });
  });

  describe("deleteCourse", () => {
    it("should return 401 when course user is undefined", async () => {
      Course.findById.mockResolvedValue({
        _id: "course123",
        user: undefined,
      });

      deleteCourse(req, res, next);
      await new Promise(setImmediate);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 401,
        }),
      );
    });
  });

  describe("updateReview", () => {
    it("should return 401 when review user is undefined", async () => {
      Review.findById.mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue({
            _id: "review123",
            user: undefined,
          }),
        }),
      });

      updateReview(req, res, next);
      await new Promise(setImmediate);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 401,
        }),
      );
    });
  });

  describe("deleteReview", () => {
    it("should return 401 when review user is undefined", async () => {
      Review.findById.mockResolvedValue({
        _id: "review123",
        user: undefined,
      });

      deleteReview(req, res, next);
      await new Promise(setImmediate);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 401,
        }),
      );
    });
  });
});
