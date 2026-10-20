jest.mock("../models", () => ({
  Bootcamp: {
    find: jest.fn(),
  },
}));

const { getBootcampsInRadius } = require("../controllers/bootcampsController");
const { geocoder } = require("../utils");

describe("Bootcamp Controller - getBootcampsInRadius Security", () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { params: { zipcode: "invalidzip", distance: "10" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return 404 ErrorResponse and avoid TypeError DoS when geocoder returns empty array", async () => {
    jest.spyOn(geocoder, "geocode").mockResolvedValue([]);

    await getBootcampsInRadius(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe("No location found for zipcode invalidzip");
  });

  it("should return 404 ErrorResponse and avoid TypeError DoS when geocoder returns null", async () => {
    jest.spyOn(geocoder, "geocode").mockResolvedValue(null);

    await getBootcampsInRadius(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe("No location found for zipcode invalidzip");
  });
});
