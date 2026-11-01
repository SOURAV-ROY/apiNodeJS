const { getBootcampsInRadius } = require("../controllers/bootcampsController");
const { ErrorResponse } = require("../utils");

const mockGeocode = jest.fn();

jest.mock("../utils", () => ({
  ErrorResponse: class ErrorResponse extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
    }
  },
  geocoder: {
    geocode: (...args) => mockGeocode(...args),
  },
}));

jest.mock("../models", () => ({
  Bootcamp: {
    find: jest.fn(),
  },
}));

describe("getBootcampsInRadius - Geocoder Null/Empty Result Validation", () => {
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

  it("should return a 404 ErrorResponse when geocoder returns an empty array", async () => {
    mockGeocode.mockResolvedValue([]);

    await getBootcampsInRadius(req, res, next);

    expect(mockGeocode).toHaveBeenCalledWith("00000");
    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(ErrorResponse);
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe("No location found for zipcode 00000");
  });

  it("should return a 404 ErrorResponse when geocoder returns null", async () => {
    mockGeocode.mockResolvedValue(null);

    await getBootcampsInRadius(req, res, next);

    expect(mockGeocode).toHaveBeenCalledWith("00000");
    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(ErrorResponse);
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe("No location found for zipcode 00000");
  });
});
