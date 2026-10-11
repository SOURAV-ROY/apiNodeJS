const {
  updateBootcamp,
  bootcampPhotoUpload,
} = require("../controllers/bootcampsController");
const { updateCourse } = require("../controllers/coursesController");
const { updateReview } = require("../controllers/reviewsController");
const { Bootcamp, Course, Review } = require("../models");

jest.mock("../middleware", () => ({
  asyncHandler: (fn) => (req, res, next) => fn(req, res, next),
}));

describe("Pre-Update Authorization Query Optimizations (.select('user').lean())", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should chain .select('user').lean() when checking authorization in updateBootcamp", async () => {
    const mockLean = jest
      .fn()
      .mockResolvedValue({ _id: "b1", user: "user123" });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    jest.spyOn(Bootcamp, "findById").mockReturnValue({ select: mockSelect });
    jest
      .spyOn(Bootcamp, "findByIdAndUpdate")
      .mockResolvedValue({ _id: "b1", name: "Updated Bootcamp" });

    const req = {
      user: { id: "user123", role: "publisher" },
      params: { id: "b1" },
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
    expect(Bootcamp.findByIdAndUpdate).toHaveBeenCalledWith(
      "b1",
      { name: "Updated Bootcamp" },
      { new: true, runValidators: true },
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should chain .select('user').lean() when checking authorization in bootcampPhotoUpload", async () => {
    const mockLean = jest
      .fn()
      .mockResolvedValue({ _id: "b1", user: "user123" });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    jest.spyOn(Bootcamp, "findById").mockReturnValue({ select: mockSelect });
    jest
      .spyOn(Bootcamp, "findByIdAndUpdate")
      .mockResolvedValue({ _id: "b1", photo: "photo_b1.jpg" });

    const mockFile = {
      name: "test.jpg",
      mimetype: "image/jpeg",
      size: 1000,
      mv: jest.fn().mockImplementation((dest, cb) => cb(null)),
    };

    const req = {
      user: { id: "user123", role: "publisher", name: "Test User" },
      params: { id: "b1" },
      files: { file: mockFile },
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
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should chain .select('user').lean() when checking authorization in updateCourse", async () => {
    const mockLean = jest
      .fn()
      .mockResolvedValue({ _id: "c1", user: "user123" });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    jest.spyOn(Course, "findById").mockReturnValue({ select: mockSelect });
    jest
      .spyOn(Course, "findByIdAndUpdate")
      .mockResolvedValue({ _id: "c1", title: "Updated Course" });

    const req = {
      user: { id: "user123", role: "publisher" },
      params: { id: "c1" },
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
    expect(Course.findByIdAndUpdate).toHaveBeenCalledWith(
      "c1",
      { title: "Updated Course" },
      { new: true, runValidators: true },
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should chain .select('user').lean() when checking authorization in updateReview", async () => {
    const mockLean = jest
      .fn()
      .mockResolvedValue({ _id: "r1", user: "user123" });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    jest.spyOn(Review, "findById").mockReturnValue({ select: mockSelect });
    jest
      .spyOn(Review, "findByIdAndUpdate")
      .mockResolvedValue({ _id: "r1", title: "Updated Review" });

    const req = {
      user: { id: "user123", role: "user" },
      params: { id: "r1" },
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
    expect(Review.findByIdAndUpdate).toHaveBeenCalledWith(
      "r1",
      { title: "Updated Review" },
      { new: true, runValidators: true },
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
