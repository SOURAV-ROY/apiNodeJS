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

describe("Bootcamps Controller - getBootcampsInRadius Security & Error Handling", () => {
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
    const errorPassed = next.mock.calls[0][0];
    expect(errorPassed.statusCode).toBe(404);
    expect(errorPassed.message).toContain("No location found for zipcode 00000");
  });

  it("should return a 404 ErrorResponse when geocoder returns null or undefined", async () => {
    geocoder.geocode.mockResolvedValue(null);

    const req = {
      params: {
        zipcode: "invalid",
        distance: "10",
      },
    };
    const res = {};
    const next = jest.fn();

    await getBootcampsInRadius(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const errorPassed = next.mock.calls[0][0];
    expect(errorPassed.statusCode).toBe(404);
  });
});
