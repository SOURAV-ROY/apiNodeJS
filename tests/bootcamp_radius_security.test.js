const { getBootcampsInRadius } = require("../controllers/bootcampsController");
const { geocoder, ErrorResponse } = require("../utils");

jest.mock("../utils/geocoder", () => ({
  geocode: jest.fn(),
}));

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
    jest.clearAllMocks();
  });

  it("should return a 404 ErrorResponse when geocoder returns an empty array", async () => {
    geocoder.geocode.mockResolvedValue([]);

    await getBootcampsInRadius(req, res, next);

    expect(geocoder.geocode).toHaveBeenCalledWith("00000");
    expect(next).toHaveBeenCalledTimes(1);
    const errorArg = next.mock.calls[0][0];
    expect(errorArg).toBeInstanceOf(ErrorResponse);
    expect(errorArg.statusCode).toBe(404);
    expect(errorArg.message).toContain("No location found for zipcode 00000");
  });

  it("should return a 404 ErrorResponse when geocoder returns null", async () => {
    geocoder.geocode.mockResolvedValue(null);

    await getBootcampsInRadius(req, res, next);

    expect(geocoder.geocode).toHaveBeenCalledWith("00000");
    expect(next).toHaveBeenCalledTimes(1);
    const errorArg = next.mock.calls[0][0];
    expect(errorArg).toBeInstanceOf(ErrorResponse);
    expect(errorArg.statusCode).toBe(404);
    expect(errorArg.message).toContain("No location found for zipcode 00000");
  });
});
