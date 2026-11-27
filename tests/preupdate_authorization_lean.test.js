const { updateBootcamp, bootcampPhotoUpload } = require("../controllers/bootcampsController");
const { updateCourse } = require("../controllers/coursesController");
const { updateReview } = require("../controllers/reviewsController");
const { Bootcamp, Course, Review } = require("../models");

jest.mock("../middleware", () => ({
  asyncHandler: (fn) => (req, res, next) => fn(req, res, next),
}));

describe("Pre-Update Authorization Query Optimizations", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should chain .select('user').lean() on Bootcamp.findById in updateBootcamp", async () => {
    const mockLean = jest.fn().mockResolvedValue({ _id: "b1", user: "u1" });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    jest.spyOn(Bootcamp, "findById").mockReturnValue({ select: mockSelect });
    jest.spyOn(Bootcamp, "findByIdAndUpdate").mockResolvedValue({ _id: "b1", name: "Updated Bootcamp" });

    const req = {
      params: { id: "b1" },
      user: { id: "u1", role: "publisher" },
      body: { name: "Updated Bootcamp" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await updateBootcamp(req, res, next);

    expect(Bootcamp.findById).toHaveBeenCalledWith("b1");
    expect(mockSelect).toHaveBeenCalledWith("user");
    expect(mockLean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should chain .select('user').lean() on Bootcamp.findById in bootcampPhotoUpload", async () => {
    const mockLean = jest.fn().mockResolvedValue({ _id: "b1", user: "u1" });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    jest.spyOn(Bootcamp, "findById").mockReturnValue({ select: mockSelect });

    const req = {
      params: { id: "b1" },
      user: { id: "u1", role: "publisher" },
      files: null, // missing file triggers 400 response
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await bootcampPhotoUpload(req, res, next);

    expect(Bootcamp.findById).toHaveBeenCalledWith("b1");
    expect(mockSelect).toHaveBeenCalledWith("user");
    expect(mockLean).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
  });

  it("should chain .select('user').lean() on Course.findById in updateCourse", async () => {
    const mockLean = jest.fn().mockResolvedValue({ _id: "c1", user: "u1" });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    jest.spyOn(Course, "findById").mockReturnValue({ select: mockSelect });
    jest.spyOn(Course, "findByIdAndUpdate").mockResolvedValue({ _id: "c1", title: "Updated Course" });

    const req = {
      params: { id: "c1" },
      user: { id: "u1", role: "publisher" },
      body: { title: "Updated Course" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await updateCourse(req, res, next);

    expect(Course.findById).toHaveBeenCalledWith("c1");
    expect(mockSelect).toHaveBeenCalledWith("user");
    expect(mockLean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should chain .select('user').lean() on Review.findById in updateReview", async () => {
    const mockLean = jest.fn().mockResolvedValue({ _id: "r1", user: "u1" });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    jest.spyOn(Review, "findById").mockReturnValue({ select: mockSelect });
    jest.spyOn(Review, "findByIdAndUpdate").mockResolvedValue({ _id: "r1", title: "Updated Review" });

    const req = {
      params: { id: "r1" },
      user: { id: "u1", role: "user" },
      body: { title: "Updated Review" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await updateReview(req, res, next);

    expect(Review.findById).toHaveBeenCalledWith("r1");
    expect(mockSelect).toHaveBeenCalledWith("user");
    expect(mockLean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
