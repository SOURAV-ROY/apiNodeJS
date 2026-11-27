const { creteBootcamp } = require("../controllers/bootcampsController");
const { addCourse } = require("../controllers/coursesController");
const { addReview } = require("../controllers/reviewsController");
const { Bootcamp, Course, Review } = require("../models");

jest.mock("../middleware", () => ({
  asyncHandler: (fn) => (req, res, next) => fn(req, res, next),
}));

describe("Bootcamp Existence Query Optimizations", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should chain .select('_id').lean() when checking for published bootcamp in creteBootcamp", async () => {
    const mockLean = jest.fn().mockResolvedValue(null);
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    jest.spyOn(Bootcamp, "findOne").mockReturnValue({ select: mockSelect });
    jest
      .spyOn(Bootcamp, "create")
      .mockResolvedValue({ _id: "b1", name: "New Bootcamp" });

    const req = {
      user: { id: "user123", role: "publisher" },
      body: { name: "New Bootcamp" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await creteBootcamp(req, res, next);

    expect(Bootcamp.findOne).toHaveBeenCalledWith({ user: "user123" });
    expect(mockSelect).toHaveBeenCalledWith("_id");
    expect(mockLean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("should chain .select('user').lean() when checking bootcamp in addCourse", async () => {
    const mockLean = jest
      .fn()
      .mockResolvedValue({ _id: "b1", user: "user123" });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    jest.spyOn(Bootcamp, "findById").mockReturnValue({ select: mockSelect });
    jest
      .spyOn(Course, "create")
      .mockResolvedValue({ _id: "c1", title: "New Course" });

    const req = {
      user: { id: "user123", role: "publisher" },
      params: { bootcampId: "b1" },
      body: { title: "New Course" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await addCourse(req, res, next);

    expect(Bootcamp.findById).toHaveBeenCalledWith("b1");
    expect(mockSelect).toHaveBeenCalledWith("user");
    expect(mockLean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should chain .select('_id').lean() when checking bootcamp in addReview", async () => {
    const mockLean = jest.fn().mockResolvedValue({ _id: "b1" });
    const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
    jest.spyOn(Bootcamp, "findById").mockReturnValue({ select: mockSelect });
    jest
      .spyOn(Review, "create")
      .mockResolvedValue({ _id: "r1", title: "New Review" });

    const req = {
      user: { id: "user123", role: "user" },
      params: { bootcampId: "b1" },
      body: { title: "New Review" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await addReview(req, res, next);

    expect(Bootcamp.findById).toHaveBeenCalledWith("b1");
    expect(mockSelect).toHaveBeenCalledWith("_id");
    expect(mockLean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
