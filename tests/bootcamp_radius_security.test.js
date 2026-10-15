const { getBootcampsInRadius } = require("../controllers/bootcampsController");
const { geocoder } = require("../utils");
const Bootcamp = require("../models/BootcampModel");
const ErrorResponse = require("../utils/ErrorResponse");

jest.mock("../utils/geocoder");
jest.mock("../models/BootcampModel");

describe("getBootcampsInRadius Security Tests", () => {
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a 404 ErrorResponse when geocoder returns an empty array", async () => {
    geocoder.geocode.mockResolvedValue([]);

    await getBootcampsInRadius(req, res, next);

    expect(geocoder.geocode).toHaveBeenCalledWith("00000");
    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(ErrorResponse);
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe("No location found for zipcode 00000");
  });

  it("should return a 404 ErrorResponse when geocoder returns null or undefined", async () => {
    geocoder.geocode.mockResolvedValue(null);

    await getBootcampsInRadius(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(ErrorResponse);
    expect(err.statusCode).toBe(404);
  });
});
