const { getBootcampsInRadius } = require("../controllers/bootcampsController");
const { Bootcamp } = require("../models");
const { geocoder } = require("../utils");
const ErrorResponse = require("../utils/ErrorResponse");

jest.mock("../models", () => ({
  Bootcamp: {
    find: jest.fn(),
  },
}));

describe("getBootcampsInRadius - Geocoder Result Validation Security", () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      params: {
        zipcode: "00000",
        distance: "10",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return a 404 ErrorResponse and avoid TypeError when geocoder returns an empty array", async () => {
    jest.spyOn(geocoder, "geocode").mockResolvedValue([]);

    await new Promise((resolve) => {
      res.json.mockImplementation(() => resolve());
      next.mockImplementation(() => resolve());
      getBootcampsInRadius(req, res, next);
    });

    expect(geocoder.geocode).toHaveBeenCalledWith("00000");
    expect(next).toHaveBeenCalledTimes(1);
    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(ErrorResponse);
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe("No location found for zipcode 00000");
    expect(Bootcamp.find).not.toHaveBeenCalled();
  });

  it("should return a 404 ErrorResponse when geocoder returns null or undefined", async () => {
    jest.spyOn(geocoder, "geocode").mockResolvedValue(null);

    await new Promise((resolve) => {
      res.json.mockImplementation(() => resolve());
      next.mockImplementation(() => resolve());
      getBootcampsInRadius(req, res, next);
    });

    expect(geocoder.geocode).toHaveBeenCalledWith("00000");
    expect(next).toHaveBeenCalledTimes(1);
    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(ErrorResponse);
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe("No location found for zipcode 00000");
  });

  it("should successfully query and return bootcamps when geocoder returns valid coordinates", async () => {
    jest.spyOn(geocoder, "geocode").mockResolvedValue([
      {
        latitude: 42.3601,
        longitude: -71.0589,
      },
    ]);

    const mockBootcamps = [{ _id: "bootcamp1", name: "Boston Code Academy" }];
    const mockQuery = {
      lean: jest.fn().mockResolvedValue(mockBootcamps),
    };
    Bootcamp.find.mockReturnValue(mockQuery);

    await new Promise((resolve) => {
      res.json.mockImplementation(() => resolve());
      next.mockImplementation(() => resolve());
      getBootcampsInRadius(req, res, next);
    });

    expect(geocoder.geocode).toHaveBeenCalledWith("00000");
    expect(Bootcamp.find).toHaveBeenCalledWith({
      location: {
        $geoWithin: {
          $centerSphere: [[-71.0589, 42.3601], 10 / 3963],
        },
      },
    });
    expect(mockQuery.lean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      count: 1,
      data: mockBootcamps,
    });
    expect(next).not.toHaveBeenCalled();
  });
});
