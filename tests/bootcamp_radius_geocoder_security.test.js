const { geocoder } = require("../utils");
const { getBootcampsInRadius } = require("../controllers/bootcampsController");
const { Bootcamp } = require("../models");

jest.mock("../utils", () => {
  const actualUtils = jest.requireActual("../utils");
  return {
    ...actualUtils,
    geocoder: {
      geocode: jest.fn(),
    },
  };
});

jest.mock("../models", () => ({
  Bootcamp: {
    find: jest.fn(),
  },
}));

describe("Bootcamp Geocoder Radius Security Check", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { zipcode: "00000", distance: "10" },
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

  it("should return 404 ErrorResponse via next() when geocoder returns empty array", async () => {
    geocoder.geocode.mockResolvedValue([]);

    getBootcampsInRadius(req, res, next);
    await new Promise(setImmediate);

    expect(geocoder.geocode).toHaveBeenCalledWith("00000");
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
        message: "No location found for zipcode 00000",
      }),
    );
  });

  it("should return 404 ErrorResponse via next() when geocoder returns null", async () => {
    geocoder.geocode.mockResolvedValue(null);

    getBootcampsInRadius(req, res, next);
    await new Promise(setImmediate);

    expect(geocoder.geocode).toHaveBeenCalledWith("00000");
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
        message: "No location found for zipcode 00000",
      }),
    );
  });

  it("should return bootcamps when geocoder returns valid location data", async () => {
    geocoder.geocode.mockResolvedValue([
      { latitude: 42.3601, longitude: -71.0589 },
    ]);
    const mockLean = jest.fn().mockResolvedValue([{ _id: "bc1" }]);
    Bootcamp.find.mockReturnValue({ lean: mockLean });

    getBootcampsInRadius(req, res, next);
    await new Promise(setImmediate);

    expect(geocoder.geocode).toHaveBeenCalledWith("00000");
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      count: 1,
      data: [{ _id: "bc1" }],
    });
  });
});
