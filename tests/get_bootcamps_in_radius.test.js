const { geocoder } = require("../utils");
const { Bootcamp, User } = require("../models");

jest.mock("../utils/geocoder", () => ({
  geocode: jest.fn(),
}));

jest.mock("../models", () => ({
  Bootcamp: {
    find: jest.fn(),
  },
  User: {
    findById: jest.fn(),
  },
}));

const { getBootcampsInRadius } = require("../controllers/bootcampsController");
const { getMe } = require("../controllers/authController");

describe("Security Fixes Tests", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { zipcode: "02118", distance: "10" },
      user: { id: "user123" },
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

  describe("getBootcampsInRadius", () => {
    it("should return 404 ErrorResponse when geocoder returns empty array without throwing TypeError", async () => {
      geocoder.geocode.mockResolvedValue([]);

      getBootcampsInRadius(req, res, next);
      await new Promise(setImmediate);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 404,
          message: "No location found for zipcode 02118",
        }),
      );
    });

    it("should return 404 ErrorResponse when geocoder returns null or undefined", async () => {
      geocoder.geocode.mockResolvedValue(null);

      getBootcampsInRadius(req, res, next);
      await new Promise(setImmediate);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 404,
          message: "No location found for zipcode 02118",
        }),
      );
    });

    it("should proceed to query bootcamps when geocoder returns valid coordinates", async () => {
      geocoder.geocode.mockResolvedValue([
        { latitude: 42.345, longitude: -71.071 },
      ]);

      Bootcamp.find.mockImplementation(() => ({
        lean: jest.fn().mockResolvedValue([{ name: "Test Bootcamp" }]),
      }));

      getBootcampsInRadius(req, res, next);
      await new Promise(setImmediate);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 1,
        data: [{ name: "Test Bootcamp" }],
      });
    });
  });

  describe("getMe", () => {
    it("should return 404 ErrorResponse when user is not found in database", async () => {
      User.findById.mockImplementation(() => ({
        lean: jest.fn().mockResolvedValue(null),
      }));

      getMe(req, res, next);
      await new Promise(setImmediate);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 404,
          message: "User not found with id of user123",
        }),
      );
    });
  });
});
