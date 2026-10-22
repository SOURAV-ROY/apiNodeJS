const { getBootcampsInRadius } = require("../controllers/bootcampsController");
const geocoder = require("../utils/geocoder");

jest.mock("../utils/geocoder");

describe("getBootcampsInRadius - Geocoder empty result handling", () => {
  it("should return 404 ErrorResponse when geocoder returns empty array", async () => {
    geocoder.geocode.mockResolvedValue([]);

    const req = {
      params: { zipcode: "00000", distance: "10" },
    };
    const res = {};
    const next = jest.fn();

    await getBootcampsInRadius(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(404);
    expect(error.message).toContain("No location found for provided zipcode 00000");
  });

  it("should return 404 ErrorResponse when geocoder returns null", async () => {
    geocoder.geocode.mockResolvedValue(null);

    const req = {
      params: { zipcode: "invalid", distance: "10" },
    };
    const res = {};
    const next = jest.fn();

    await getBootcampsInRadius(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(404);
    expect(error.message).toContain("No location found for provided zipcode invalid");
  });
});
