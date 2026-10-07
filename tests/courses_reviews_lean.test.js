const { getCourses, getCourse } = require("../controllers/coursesController");
const { getReviews, getReview } = require("../controllers/reviewsController");
const { Course, Review } = require("../models");

jest.mock("../models", () => {
  const mockCourseChain = {
    populate: jest.fn().mockReturnThis(),
    lean: jest.fn().mockResolvedValue({ _id: "course123", title: "Test Course" }),
  };

  const mockReviewChain = {
    populate: jest.fn().mockReturnThis(),
    lean: jest.fn().mockResolvedValue({ _id: "review123", title: "Test Review" }),
  };

  return {
    Course: {
      find: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue([{ _id: "course123", title: "Test Course" }]),
      }),
      findById: jest.fn().mockReturnValue(mockCourseChain),
    },
    Review: {
      find: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue([{ _id: "review123", title: "Test Review" }]),
      }),
      findById: jest.fn().mockReturnValue(mockReviewChain),
    },
  };
});

describe("Courses & Reviews Controllers - Lean Query Performance", () => {
  let req, res, next;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("getCourses with bootcampId should execute find().lean()", async () => {
    req = { params: { bootcampId: "bootcamp123" } };
    await getCourses(req, res, next);

    expect(Course.find).toHaveBeenCalledWith({ bootcamp: "bootcamp123" });
    const findQuery = Course.find.mock.results[0].value;
    expect(findQuery.lean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("getCourse should execute findById().populate().lean()", async () => {
    req = { params: { id: "course123" } };
    await getCourse(req, res, next);

    expect(Course.findById).toHaveBeenCalledWith("course123");
    const findByIdQuery = Course.findById.mock.results[0].value;
    expect(findByIdQuery.populate).toHaveBeenCalledWith({
      path: "bootcamp",
      select: "name description",
    });
    expect(findByIdQuery.lean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("getReviews with bootcampId should execute find().lean()", async () => {
    req = { params: { bootcampId: "bootcamp123" } };
    await getReviews(req, res, next);

    expect(Review.find).toHaveBeenCalledWith({ bootcamp: "bootcamp123" });
    const findQuery = Review.find.mock.results[0].value;
    expect(findQuery.lean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("getReview should execute findById().populate().lean()", async () => {
    req = { params: { id: "review123" } };
    await getReview(req, res, next);

    expect(Review.findById).toHaveBeenCalledWith("review123");
    const findByIdQuery = Review.findById.mock.results[0].value;
    expect(findByIdQuery.populate).toHaveBeenCalledWith({
      path: "bootcamp",
      select: "name description",
    });
    expect(findByIdQuery.lean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
