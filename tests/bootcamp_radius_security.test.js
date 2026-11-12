const { getBootcampsInRadius } = require("../controllers/bootcampsController");
const { Bootcamp } = require("../models");
const { geocoder } = require("../utils");
const ErrorResponse = require("../utils/ErrorResponse");

jest.mock("../models", () => ({
  Bootcamp: {
    find: jest.fn(),
  },
}));

describe("Bootcamp Radius Geocode Security", () => {
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

  it("should return 404 ErrorResponse and not throw TypeError when geocoder returns empty array", async () => {
    jest.spyOn(geocoder, "geocode").mockResolvedValue([]);

    await new Promise((resolve) => {
      next.mockImplementation(() => resolve());
      res.json.mockImplementation(() => resolve());
      getBootcampsInRadius(req, res, next);
    });

    expect(geocoder.geocode).toHaveBeenCalledWith("00000");
    expect(next).toHaveBeenCalledTimes(1);
    const errorArg = next.mock.calls[0][0];
    expect(errorArg).toBeInstanceOf(ErrorResponse);
    expect(errorArg.statusCode).toBe(404);
    expect(errorArg.message).toContain("No location found");
    expect(Bootcamp.find).not.toHaveBeenCalled();
  });

  it("should return 404 ErrorResponse and not throw TypeError when geocoder returns null or undefined", async () => {
    jest.spyOn(geocoder, "geocode").mockResolvedValue(null);

    await new Promise((resolve) => {
      next.mockImplementation(() => resolve());
      res.json.mockImplementation(() => resolve());
      getBootcampsInRadius(req, res, next);
    });

    expect(geocoder.geocode).toHaveBeenCalledWith("00000");
    expect(next).toHaveBeenCalledTimes(1);
    const errorArg = next.mock.calls[0][0];
    expect(errorArg).toBeInstanceOf(ErrorResponse);
    expect(errorArg.statusCode).toBe(404);
    expect(Bootcamp.find).not.toHaveBeenCalled();
  });

  it("should query bootcamps and return results when geocoder returns valid coordinates", async () => {
    jest.spyOn(geocoder, "geocode").mockResolvedValue([
      {
        latitude: 42.3601,
        longitude: -71.0589,
      },
    ]);

    const mockBootcamps = [{ _id: "b1", name: "Boston Bootcamp" }];
    const mockQuery = {
      lean: jest.fn().mockResolvedValue(mockBootcamps),
    };
    Bootcamp.find.mockReturnValue(mockQuery);

    await new Promise((resolve) => {
      next.mockImplementation(() => resolve());
      res.json.mockImplementation(() => resolve());
      getBootcampsInRadius(req, res, next);
    });

    expect(geocoder.geocode).toHaveBeenCalledWith("00000");
    expect(next).not.toHaveBeenCalled();
    expect(Bootcamp.find).toHaveBeenCalled();
    expect(mockQuery.lean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      count: 1,
      data: mockBootcamps,
    });
  });
});
