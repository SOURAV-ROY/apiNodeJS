const { getBootcampsInRadius } = require("../controllers/bootcampsController");
const { Bootcamp } = require("../models");
const { geocoder, ErrorResponse } = require("../utils");

jest.mock("../models", () => ({
  Bootcamp: {
    find: jest.fn(),
  },
}));

describe("getBootcampsInRadius - Geocoder Security / Denial of Service Prevention", () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      params: {
        zipcode: "02118",
        distance: "10",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return a 404 ErrorResponse and not throw an unhandled TypeError when geocoder returns empty array", async () => {
    jest.spyOn(geocoder, "geocode").mockResolvedValue([]);

    await new Promise((resolve) => {
      next.mockImplementation(() => resolve());
      res.json.mockImplementation(() => resolve());
      getBootcampsInRadius(req, res, next);
    });

    expect(geocoder.geocode).toHaveBeenCalledWith("02118");
    expect(next).toHaveBeenCalledWith(expect.any(ErrorResponse));
    const errorArg = next.mock.calls[0][0];
    expect(errorArg.statusCode).toBe(404);
    expect(errorArg.message).toBe("No location found for zipcode 02118");
    expect(Bootcamp.find).not.toHaveBeenCalled();
  });

  it("should return a 404 ErrorResponse when geocoder returns null or undefined", async () => {
    jest.spyOn(geocoder, "geocode").mockResolvedValue(null);

    await new Promise((resolve) => {
      next.mockImplementation(() => resolve());
      res.json.mockImplementation(() => resolve());
      getBootcampsInRadius(req, res, next);
    });

    expect(geocoder.geocode).toHaveBeenCalledWith("02118");
    expect(next).toHaveBeenCalledWith(expect.any(ErrorResponse));
    const errorArg = next.mock.calls[0][0];
    expect(errorArg.statusCode).toBe(404);
    expect(errorArg.message).toBe("No location found for zipcode 02118");
    expect(Bootcamp.find).not.toHaveBeenCalled();
  });

  it("should proceed normally with 200 when geocoder returns valid coordinates", async () => {
    jest.spyOn(geocoder, "geocode").mockResolvedValue([
      {
        latitude: 42.3421,
        longitude: -71.0722,
      },
    ]);

    const mockQuery = {
      lean: jest
        .fn()
        .mockResolvedValue([{ _id: "bootcamp1", name: "DevCamp" }]),
    };
    Bootcamp.find.mockReturnValue(mockQuery);

    await new Promise((resolve) => {
      next.mockImplementation(() => resolve());
      res.json.mockImplementation(() => resolve());
      getBootcampsInRadius(req, res, next);
    });

    expect(geocoder.geocode).toHaveBeenCalledWith("02118");
    expect(Bootcamp.find).toHaveBeenCalledWith({
      location: {
        $geoWithin: {
          $centerSphere: [[-71.0722, 42.3421], 10 / 3963],
        },
      },
    });
    expect(mockQuery.lean).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      count: 1,
      data: [{ _id: "bootcamp1", name: "DevCamp" }],
    });
  });
});
