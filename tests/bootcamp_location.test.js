const { getBootcampsInRadius } = require("../controllers/bootcampsController");
const { geocoder } = require("../utils");
const ErrorResponse = require("../utils/ErrorResponse");

jest.mock("../utils", () => {
  const originalModule = jest.requireActual("../utils");
  return {
    ...originalModule,
    geocoder: {
      geocode: jest.fn(),
    },
  };
});

describe("bootcampsController getBootcampsInRadius - Location Verification", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a 404 ErrorResponse when geocoder returns an empty array", async () => {
    geocoder.geocode.mockResolvedValue([]);

    const req = {
      params: { zipcode: "00000", distance: "10" },
    };
    const res = {};
    const next = jest.fn();

    await getBootcampsInRadius(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ErrorResponse));
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(404);
    expect(error.message).toContain("No location found");
  });

  it("should return a 404 ErrorResponse when geocoder returns null or undefined", async () => {
    geocoder.geocode.mockResolvedValue(null);

    const req = {
      params: { zipcode: "invalid_zip", distance: "10" },
    };
    const res = {};
    const next = jest.fn();

    await getBootcampsInRadius(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ErrorResponse));
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(404);
  });
});
