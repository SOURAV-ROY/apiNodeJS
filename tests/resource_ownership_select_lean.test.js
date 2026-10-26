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

describe("Pre-update ownership check optimization (.select('user').lean())", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { id: "123456789012345678901234" },
      body: { name: "Updated Name" },
      user: { id: "user123", role: "publisher" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should chain .select('user').lean() in updateBootcamp", async () => {
    const mockQuery = {
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue({ _id: "123456789012345678901234", user: "user123" }),
    };
    Bootcamp.findById.mockReturnValue(mockQuery);

    await updateBootcamp(req, res, next);

    expect(Bootcamp.findById).toHaveBeenCalledWith("123456789012345678901234");
    expect(mockQuery.select).toHaveBeenCalledWith("user");
    expect(mockQuery.lean).toHaveBeenCalled();
  });

  it("should chain .select('user').lean() in bootcampPhotoUpload", async () => {
    const mockQuery = {
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue({ _id: "123456789012345678901234", user: "user123" }),
    };
    Bootcamp.findById.mockReturnValue(mockQuery);
    req.files = { file: { name: "test.jpg", mimetype: "image/jpeg", size: 100, mv: jest.fn((p, cb) => cb(null)) } };

    await bootcampPhotoUpload(req, res, next);

    expect(Bootcamp.findById).toHaveBeenCalledWith("123456789012345678901234");
    expect(mockQuery.select).toHaveBeenCalledWith("user");
    expect(mockQuery.lean).toHaveBeenCalled();
  });

  it("should chain .select('user').lean() in updateCourse", async () => {
    const mockQuery = {
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue({ _id: "123456789012345678901234", user: "user123" }),
    };
    Course.findById.mockReturnValue(mockQuery);

    await updateCourse(req, res, next);

    expect(Course.findById).toHaveBeenCalledWith("123456789012345678901234");
    expect(mockQuery.select).toHaveBeenCalledWith("user");
    expect(mockQuery.lean).toHaveBeenCalled();
  });

  it("should chain .select('user').lean() in updateReview", async () => {
    const mockQuery = {
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue({ _id: "123456789012345678901234", user: "user123" }),
    };
    Review.findById.mockReturnValue(mockQuery);

    await updateReview(req, res, next);

    expect(Review.findById).toHaveBeenCalledWith("123456789012345678901234");
    expect(mockQuery.select).toHaveBeenCalledWith("user");
    expect(mockQuery.lean).toHaveBeenCalled();
  });
});
