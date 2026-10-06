jest.mock("../models", () => ({
  Course: {
    find: jest.fn(),
    findById: jest.fn(),
  },
  Review: {
    find: jest.fn(),
    findById: jest.fn(),
  },
  Bootcamp: {
    find: jest.fn(),
    findById: jest.fn(),
  },
  User: {
    findById: jest.fn(),
  },
}));

const { getCourses, getCourse } = require("../controllers/coursesController");
const { getReviews, getReview } = require("../controllers/reviewsController");
const {
  getBootcamp,
  getBootcampsInRadius,
} = require("../controllers/bootcampsController");
const { getUser } = require("../controllers/usersController");
const { getMe } = require("../controllers/authController");
const { Course, Review, Bootcamp, User } = require("../models");
const { geocoder } = require("../utils");

describe("Read-only controller queries - .lean() optimization", () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { params: {}, user: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("getCourses with bootcampId should chain .lean()", async () => {
    const mockQuery = {
      lean: jest.fn().mockResolvedValue([{ _id: "c1", title: "Course 1" }]),
    };
    Course.find.mockReturnValue(mockQuery);

    req.params.bootcampId = "b123";
    await getCourses(req, res, next);

    expect(Course.find).toHaveBeenCalledWith({ bootcamp: "b123" });
    expect(mockQuery.lean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      count: 1,
      data: [{ _id: "c1", title: "Course 1" }],
    });
  });

  it("getCourse should chain .lean()", async () => {
    const mockQuery = {
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue({ _id: "c1", title: "Course 1" }),
    };
    Course.findById.mockReturnValue(mockQuery);

    req.params.id = "c1";
    await getCourse(req, res, next);

    expect(Course.findById).toHaveBeenCalledWith("c1");
    expect(mockQuery.populate).toHaveBeenCalledWith({
      path: "bootcamp",
      select: "name description",
    });
    expect(mockQuery.lean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("getReviews with bootcampId should chain .lean()", async () => {
    const mockQuery = {
      lean: jest.fn().mockResolvedValue([{ _id: "r1", title: "Review 1" }]),
    };
    Review.find.mockReturnValue(mockQuery);

    req.params.bootcampId = "b123";
    await getReviews(req, res, next);

    expect(Review.find).toHaveBeenCalledWith({ bootcamp: "b123" });
    expect(mockQuery.lean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("getReview should chain .lean()", async () => {
    const mockQuery = {
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue({ _id: "r1", title: "Review 1" }),
    };
    Review.findById.mockReturnValue(mockQuery);

    req.params.id = "r1";
    await getReview(req, res, next);

    expect(Review.findById).toHaveBeenCalledWith("r1");
    expect(mockQuery.lean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("getBootcamp should chain .lean()", async () => {
    const mockQuery = {
      lean: jest.fn().mockResolvedValue({ _id: "b1", name: "Bootcamp 1" }),
    };
    Bootcamp.findById.mockReturnValue(mockQuery);

    req.params.id = "b1";
    await getBootcamp(req, res, next);

    expect(Bootcamp.findById).toHaveBeenCalledWith("b1");
    expect(mockQuery.lean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("getBootcampsInRadius should chain .lean()", async () => {
    jest
      .spyOn(geocoder, "geocode")
      .mockResolvedValue([{ latitude: 10, longitude: 20 }]);

    const mockQuery = {
      lean: jest.fn().mockResolvedValue([{ _id: "b1", name: "Bootcamp 1" }]),
    };
    Bootcamp.find.mockReturnValue(mockQuery);

    req.params = { zipcode: "02118", distance: "10" };
    await new Promise((resolve) => {
      res.json.mockImplementation(() => resolve());
      next.mockImplementation(() => resolve());
      getBootcampsInRadius(req, res, next);
    });

    expect(Bootcamp.find).toHaveBeenCalled();
    expect(mockQuery.lean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("getUser should chain .lean()", async () => {
    const mockQuery = {
      lean: jest.fn().mockResolvedValue({ _id: "u1", name: "User 1" }),
    };
    User.findById.mockReturnValue(mockQuery);

    req.params.id = "u1";
    await getUser(req, res, next);

    expect(User.findById).toHaveBeenCalledWith("u1");
    expect(mockQuery.lean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("getMe should chain .lean()", async () => {
    const mockQuery = {
      lean: jest.fn().mockResolvedValue({ _id: "u1", name: "User 1" }),
    };
    User.findById.mockReturnValue(mockQuery);

    req.user.id = "u1";
    await getMe(req, res, next);

    expect(User.findById).toHaveBeenCalledWith("u1");
    expect(mockQuery.lean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
