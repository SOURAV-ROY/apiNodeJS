const { getBootcampsInRadius } = require("../controllers/bootcampsController");
const { geocoder, ErrorResponse } = require("../utils");

describe("getBootcampsInRadius Security - Invalid/Empty Geocoder Location Check", () => {
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
    jest.restoreAllMocks();
  });

  it("should pass a 404 ErrorResponse to next when geocoder returns an empty location array", async () => {
    jest.spyOn(geocoder, "geocode").mockResolvedValue([]);

    await getBootcampsInRadius(req, res, next);

    expect(geocoder.geocode).toHaveBeenCalledWith("00000");
    expect(next).toHaveBeenCalledTimes(1);

    const errorPassed = next.mock.calls[0][0];
    expect(errorPassed).toBeInstanceOf(ErrorResponse);
    expect(errorPassed.statusCode).toBe(404);
    expect(errorPassed.message).toContain("No location found for zipcode 00000");
  });

  it("should pass a 404 ErrorResponse to next when geocoder returns null or undefined", async () => {
    jest.spyOn(geocoder, "geocode").mockResolvedValue(null);

    await getBootcampsInRadius(req, res, next);

    expect(geocoder.geocode).toHaveBeenCalledWith("00000");
    expect(next).toHaveBeenCalledTimes(1);

    const errorPassed = next.mock.calls[0][0];
    expect(errorPassed).toBeInstanceOf(ErrorResponse);
    expect(errorPassed.statusCode).toBe(404);
    expect(errorPassed.message).toContain("No location found for zipcode 00000");
  });
});
