const { Bootcamp } = require("../models");
const { geocoder } = require("../utils");
const { getBootcampsInRadius } = require("../controllers/bootcampsController");

jest.mock("../models", () => ({
  Bootcamp: {
    find: jest.fn(),
  },
}));

jest.mock("../utils", () => {
  const actualUtils = jest.requireActual("../utils");
  return {
    ...actualUtils,
    geocoder: {
      geocode: jest.fn(),
    },
  };
});

describe("Bootcamp Radius Controller - Geocoder Error Handling & DoS Prevention", () => {
  let req, res, next;

  beforeEach(() => {
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
    jest.clearAllMocks();
  });

  it("should return a 404 ErrorResponse and not crash when geocoder returns an empty array", async () => {
    geocoder.geocode.mockResolvedValue([]);

    getBootcampsInRadius(req, res, next);
    await new Promise((resolve) => setImmediate(resolve));

    expect(geocoder.geocode).toHaveBeenCalledWith("00000");
    expect(next).toHaveBeenCalledTimes(1);
    const errorPassed = next.mock.calls[0][0];
    expect(errorPassed.statusCode).toBe(404);
    expect(errorPassed.message).toMatch(/No location found for zipcode 00000/);
    expect(Bootcamp.find).not.toHaveBeenCalled();
  });

  it("should return a 404 ErrorResponse and not crash when geocoder returns null or undefined", async () => {
    geocoder.geocode.mockResolvedValue(null);

    getBootcampsInRadius(req, res, next);
    await new Promise((resolve) => setImmediate(resolve));

    expect(geocoder.geocode).toHaveBeenCalledWith("00000");
    expect(next).toHaveBeenCalledTimes(1);
    const errorPassed = next.mock.calls[0][0];
    expect(errorPassed.statusCode).toBe(404);
    expect(errorPassed.message).toMatch(/No location found for zipcode 00000/);
    expect(Bootcamp.find).not.toHaveBeenCalled();
  });

  it("should find bootcamps and return 200 when geocoder returns valid coordinates", async () => {
    geocoder.geocode.mockResolvedValue([
      {
        latitude: 42.3601,
        longitude: -71.0589,
      },
    ]);

    const mockBootcamps = [{ _id: "b1", name: "Boston Code Camp" }];
    const mockLean = jest.fn().mockResolvedValue(mockBootcamps);
    Bootcamp.find.mockReturnValue({ lean: mockLean });

    getBootcampsInRadius(req, res, next);
    await new Promise((resolve) => setImmediate(resolve));

    expect(geocoder.geocode).toHaveBeenCalledWith("00000");
    expect(Bootcamp.find).toHaveBeenCalledWith({
      location: {
        $geoWithin: {
          $centerSphere: [[-71.0589, 42.3601], 10 / 3963],
        },
      },
    });
    expect(mockLean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      count: 1,
      data: mockBootcamps,
    });
    expect(next).not.toHaveBeenCalled();
  });
});
