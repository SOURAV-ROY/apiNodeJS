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

describe("Pre-update authorization query performance optimization (.select('user').lean())", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("updateBootcamp should chain .select('user').lean() on pre-update findById lookup", async () => {
    const mockLean = jest.fn().mockResolvedValue({
      _id: "bootcamp123",
      user: "user123",
    });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    Bootcamp.findById.mockReturnValue({ select: mockSelect });
    Bootcamp.findByIdAndUpdate.mockResolvedValue({ _id: "bootcamp123", name: "Updated Bootcamp" });

    const req = {
      params: { id: "bootcamp123" },
      user: { id: "user123", role: "publisher" },
      body: { name: "Updated Bootcamp" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await new Promise((resolve) => {
      res.json.mockImplementation(() => resolve());
      next.mockImplementation((err) => resolve(err));
      updateBootcamp(req, res, next);
    });

    expect(Bootcamp.findById).toHaveBeenCalledWith("bootcamp123");
    expect(mockSelect).toHaveBeenCalledWith("user");
    expect(mockLean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("bootcampPhotoUpload should chain .select('user').lean() on pre-upload findById lookup", async () => {
    const mockLean = jest.fn().mockResolvedValue({
      _id: "bootcamp123",
      user: "user123",
    });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    Bootcamp.findById.mockReturnValue({ select: mockSelect });

    const req = {
      params: { id: "bootcamp123" },
      user: { id: "user123", role: "publisher" },
      files: undefined, // Will hit "Please Upload A File" after ownership check passing
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await new Promise((resolve) => {
      res.json.mockImplementation(() => resolve());
      next.mockImplementation((err) => resolve(err));
      bootcampPhotoUpload(req, res, next);
    });

    expect(Bootcamp.findById).toHaveBeenCalledWith("bootcamp123");
    expect(mockSelect).toHaveBeenCalledWith("user");
    expect(mockLean).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: "Please Upload A File", statusCode: 400 }));
  });

  it("updateCourse should chain .select('user').lean() on pre-update findById lookup", async () => {
    const mockLean = jest.fn().mockResolvedValue({
      _id: "course123",
      user: "user123",
    });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    Course.findById.mockReturnValue({ select: mockSelect });
    Course.findByIdAndUpdate.mockResolvedValue({ _id: "course123", title: "Updated Course" });

    const req = {
      params: { id: "course123" },
      user: { id: "user123", role: "publisher" },
      body: { title: "Updated Course" },
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

    expect(Course.findById).toHaveBeenCalledWith("course123");
    expect(mockSelect).toHaveBeenCalledWith("user");
    expect(mockLean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("updateReview should chain .select('user').lean() on pre-update findById lookup", async () => {
    const mockLean = jest.fn().mockResolvedValue({
      _id: "review123",
      user: "user123",
    });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    Review.findById.mockReturnValue({ select: mockSelect });
    Review.findByIdAndUpdate.mockResolvedValue({ _id: "review123", title: "Updated Review" });

    const req = {
      params: { id: "review123" },
      user: { id: "user123", role: "user" },
      body: { title: "Updated Review" },
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

    expect(Review.findById).toHaveBeenCalledWith("review123");
    expect(mockSelect).toHaveBeenCalledWith("user");
    expect(mockLean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
