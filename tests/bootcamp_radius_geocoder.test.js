const { getBootcampsInRadius } = require("../controllers/bootcampsController");
const { geocoder } = require("../utils");

jest.mock("../utils", () => {
  const originalUtils = jest.requireActual("../utils");
  return {
    ...originalUtils,
    geocoder: {
      geocode: jest.fn(),
    },
  };
});

describe("getBootcampsInRadius - Geocoder Validation", () => {
  it("should return a 404 ErrorResponse when geocoder returns an empty array", async () => {
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
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(404);
    expect(error.message).toContain("No location found for zipcode 00000");
  });

  it("should return a 404 ErrorResponse when geocoder returns null", async () => {
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
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(404);
    expect(error.message).toContain("No location found for zipcode invalidzip");
  });
});
