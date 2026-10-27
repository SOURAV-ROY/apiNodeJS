const { getBootcampsInRadius } = require("../controllers/bootcampsController");
const { geocoder, ErrorResponse } = require("../utils");

jest.mock("../utils/geocoder", () => ({
  geocode: jest.fn(),
}));

describe("Bootcamp Geocoder Security - Empty Location Handling", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 404 ErrorResponse when geocoder returns empty array", async () => {
    geocoder.geocode.mockResolvedValue([]);

    const req = {
      params: {
        zipcode: "00000",
        distance: "10",
      },
    };
    const res = {};
    const next = jest.fn();

    await getBootcampsInRadius(req, res, next);

    expect(geocoder.geocode).toHaveBeenCalledWith("00000");
    expect(next).toHaveBeenCalledTimes(1);
    const errorArg = next.mock.calls[0][0];
    expect(errorArg).toBeInstanceOf(ErrorResponse);
    expect(errorArg.statusCode).toBe(404);
    expect(errorArg.message).toContain("No location found for the provided zipcode 00000");
  });

  it("should return 404 ErrorResponse when geocoder returns null or undefined", async () => {
    geocoder.geocode.mockResolvedValue(null);

    const req = {
      params: {
        zipcode: "invalidzip",
        distance: "10",
      },
    };
    const res = {};
    const next = jest.fn();

    await getBootcampsInRadius(req, res, next);

    expect(geocoder.geocode).toHaveBeenCalledWith("invalidzip");
    expect(next).toHaveBeenCalledTimes(1);
    const errorArg = next.mock.calls[0][0];
    expect(errorArg).toBeInstanceOf(ErrorResponse);
    expect(errorArg.statusCode).toBe(404);
    expect(errorArg.message).toContain("No location found for the provided zipcode invalidzip");
  });
});
