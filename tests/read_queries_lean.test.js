const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

jest.mock("../models/UserModel", () => ({
  findById: jest.fn(),
}));

jest.mock("../models", () => ({
  User: require("../models/UserModel"),
  Bootcamp: {
    findById: jest.fn(),
    find: jest.fn(),
  },
  Course: {
    findById: jest.fn(),
    find: jest.fn(),
  },
  Review: {
    findById: jest.fn(),
    find: jest.fn(),
  },
}));

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

const mockGeocode = jest.fn();

jest.mock("../utils", () => ({
  ErrorResponse: class ErrorResponse extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
    }
  },
  geocoder: {
    geocode: mockGeocode,
  },
}));

const { protect } = require("../middleware/auth");
const { getBootcamp, getBootcampsInRadius } = require("../controllers/bootcampsController");
const { getCourse, getCourses } = require("../controllers/coursesController");
const { getReview, getReviews } = require("../controllers/reviewsController");
const { getUser } = require("../controllers/usersController");
const { getMe } = require("../controllers/authController");
const { Bootcamp, Course, Review } = require("../models");

describe("Read-Only Query Performance Optimizations (.lean)", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
      cookies: {},
      params: {},
      user: null,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
    mockGeocode.mockResolvedValue([{ latitude: 10, longitude: 20 }]);
  });

  describe("middleware/auth.js (protect)", () => {
    it("should chain .lean() when retrieving user in protect middleware and set req.user.id", async () => {
      req.headers.authorization = "Bearer fakeToken";
      jwt.verify.mockReturnValue({ id: "user123" });

      const mockQuery = {
        lean: jest.fn().mockResolvedValue({
          _id: "user123",
          name: "Test User",
          role: "user",
        }),
      };
      User.findById.mockReturnValue(mockQuery);

      await protect(req, res, next);

      expect(User.findById).toHaveBeenCalledWith("user123");
      expect(mockQuery.lean).toHaveBeenCalled();
      expect(req.user.id).toEqual("user123");
      expect(next).toHaveBeenCalled();
    });
  });

  describe("controllers/bootcampsController.js", () => {
    it("getBootcamp should chain .lean()", async () => {
      req.params.id = "bootcamp123";
      const mockQuery = {
        lean: jest.fn().mockResolvedValue({ _id: "bootcamp123", name: "DevCamp" }),
      };
      Bootcamp.findById.mockReturnValue(mockQuery);

      await getBootcamp(req, res, next);

      expect(Bootcamp.findById).toHaveBeenCalledWith("bootcamp123");
      expect(mockQuery.lean).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { _id: "bootcamp123", name: "DevCamp" },
      });
    });

    it("getBootcampsInRadius should chain .lean()", async () => {
      req.params = { zipcode: "02118", distance: "10" };
      const mockQuery = {
        lean: jest.fn().mockResolvedValue([{ _id: "b1", name: "Camp 1" }]),
      };
      Bootcamp.find.mockReturnValue(mockQuery);

      getBootcampsInRadius(req, res, next);
      await new Promise((resolve) => setImmediate(resolve));

      expect(mockQuery.lean).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 1,
        data: [{ _id: "b1", name: "Camp 1" }],
      });
    });
  });

  describe("controllers/coursesController.js", () => {
    it("getCourse should chain .lean()", async () => {
      req.params.id = "course123";
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue({ _id: "course123", title: "Web Dev" }),
      };
      Course.findById.mockReturnValue(mockQuery);

      await getCourse(req, res, next);

      expect(Course.findById).toHaveBeenCalledWith("course123");
      expect(mockQuery.lean).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("getCourses with bootcampId should chain .lean()", async () => {
      req.params.bootcampId = "bootcamp123";
      const mockQuery = {
        lean: jest.fn().mockResolvedValue([{ _id: "c1", title: "Course 1" }]),
      };
      Course.find.mockReturnValue(mockQuery);

      await getCourses(req, res, next);

      expect(Course.find).toHaveBeenCalledWith({ bootcamp: "bootcamp123" });
      expect(mockQuery.lean).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("controllers/reviewsController.js", () => {
    it("getReview should chain .lean()", async () => {
      req.params.id = "review123";
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue({ _id: "review123", title: "Great!" }),
      };
      Review.findById.mockReturnValue(mockQuery);

      await getReview(req, res, next);

      expect(Review.findById).toHaveBeenCalledWith("review123");
      expect(mockQuery.lean).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("getReviews with bootcampId should chain .lean()", async () => {
      req.params.bootcampId = "bootcamp123";
      const mockQuery = {
        lean: jest.fn().mockResolvedValue([{ _id: "r1", title: "Review 1" }]),
      };
      Review.find.mockReturnValue(mockQuery);

      await getReviews(req, res, next);

      expect(Review.find).toHaveBeenCalledWith({ bootcamp: "bootcamp123" });
      expect(mockQuery.lean).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("controllers/usersController.js", () => {
    it("getUser should chain .lean()", async () => {
      req.params.id = "user123";
      const mockQuery = {
        lean: jest.fn().mockResolvedValue({ _id: "user123", name: "John" }),
      };
      User.findById.mockReturnValue(mockQuery);

      await getUser(req, res, next);

      expect(User.findById).toHaveBeenCalledWith("user123");
      expect(mockQuery.lean).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("controllers/authController.js", () => {
    it("getMe should chain .lean()", async () => {
      req.user = { id: "user123" };
      const mockQuery = {
        lean: jest.fn().mockResolvedValue({ _id: "user123", name: "John" }),
      };
      User.findById.mockReturnValue(mockQuery);

      await getMe(req, res, next);

      expect(User.findById).toHaveBeenCalledWith("user123");
      expect(mockQuery.lean).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
