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

describe("Ownership Optional Chaining Security Tests", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { id: "60d5ec49f1b2c80015f8e001", bootcampId: "60d5ec49f1b2c80015f8e002" },
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

  describe("Course Controller", () => {
    it("should handle missing user on bootcamp in addCourse safely without throwing TypeError", async () => {
      Bootcamp.findById.mockResolvedValue({
        _id: "60d5ec49f1b2c80015f8e002",
        user: undefined,
      });

      addCourse(req, res, next);
      await new Promise(setImmediate);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 401,
        }),
      );
    });

    it("should handle missing user on course in updateCourse safely without throwing TypeError", async () => {
      Course.findById.mockResolvedValue({
        _id: "60d5ec49f1b2c80015f8e001",
        user: undefined,
      });

      updateCourse(req, res, next);
      await new Promise(setImmediate);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 401,
        }),
      );
    });

    it("should handle missing user on course in deleteCourse safely without throwing TypeError", async () => {
      Course.findById.mockResolvedValue({
        _id: "60d5ec49f1b2c80015f8e001",
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

  describe("Review Controller", () => {
    it("should handle missing user on review in updateReview safely without throwing TypeError", async () => {
      Review.findById.mockResolvedValue({
        _id: "60d5ec49f1b2c80015f8e001",
        user: undefined,
      });

      updateReview(req, res, next);
      await new Promise(setImmediate);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 401,
        }),
      );
    });

    it("should handle missing user on review in deleteReview safely without throwing TypeError", async () => {
      Review.findById.mockResolvedValue({
        _id: "60d5ec49f1b2c80015f8e001",
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
