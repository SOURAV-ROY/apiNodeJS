const { updateCourse } = require("../controllers/coursesController");
const { updateReview } = require("../controllers/reviewsController");
const { Course, Review } = require("../models");

jest.mock("../models", () => ({
  Course: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
  Review: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

describe("Mass Assignment Security - Courses and Reviews", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should strip user and bootcamp fields from req.body when updating a course", async () => {
    const mockCourse = {
      _id: "course123",
      user: "user123",
      bootcamp: "bootcamp123",
      title: "Original Course Title",
    };

    Course.findById.mockResolvedValue(mockCourse);
    Course.findByIdAndUpdate.mockResolvedValue({
      ...mockCourse,
      title: "Updated Course Title",
    });

    const req = {
      params: { id: "course123" },
      user: { id: "user123", role: "publisher" },
      body: {
        title: "Updated Course Title",
        user: "attacker456", // Attempted mass assignment / ownership transfer
        bootcamp: "bootcamp999", // Attempted course relocation
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await new Promise((resolve) => {
      res.json.mockImplementation(() => resolve());
      next.mockImplementation((err) => resolve(err));
      updateCourse(req, res, next);
    });

    expect(Course.findByIdAndUpdate).toHaveBeenCalledWith(
      "course123",
      { title: "Updated Course Title" },
      { new: true, runValidators: true },
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should strip user and bootcamp fields from req.body when updating a review", async () => {
    const mockReview = {
      _id: "review123",
      user: "user123",
      bootcamp: "bootcamp123",
      title: "Original Review Title",
    };

    Review.findById.mockResolvedValue(mockReview);
    Review.findByIdAndUpdate.mockResolvedValue({
      ...mockReview,
      title: "Updated Review Title",
    });

    const req = {
      params: { id: "review123" },
      user: { id: "user123", role: "user" },
      body: {
        title: "Updated Review Title",
        user: "attacker456", // Attempted mass assignment / ownership transfer
        bootcamp: "bootcamp999", // Attempted review reassignment
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await new Promise((resolve) => {
      res.json.mockImplementation(() => resolve());
      next.mockImplementation((err) => resolve(err));
      updateReview(req, res, next);
    });

    expect(Review.findByIdAndUpdate).toHaveBeenCalledWith(
      "review123",
      { title: "Updated Review Title" },
      { new: true, runValidators: true },
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
