const { Course, Bootcamp, Review } = require("../models");

jest.mock("../models", () => ({
  Course: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    create: jest.fn(),
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

describe("Resource Ownership Authorization Security (Optional Chaining)", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {
        id: "60d5ec49f1b2c80015f8e001",
        bootcampId: "60d5ec49f1b2c80015f8e002",
      },
      user: { id: "user123", role: "publisher" },
      body: { name: "Test Resource" },
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

  it("should prevent server crash and return 401 in addCourse when bootcamp user is undefined", async () => {
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

  it("should prevent server crash and return 401 in updateCourse when course user is undefined", async () => {
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

  it("should prevent server crash and return 401 in deleteCourse when course user is undefined", async () => {
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

  it("should prevent server crash and return 401 in updateReview when review user is undefined", async () => {
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

  it("should prevent server crash and return 401 in deleteReview when review user is undefined", async () => {
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
