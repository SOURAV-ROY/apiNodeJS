const { getBootcampsInRadius } = require("../controllers/bootcampsController");
const { geocoder, ErrorResponse } = require("../utils");

jest.mock("../utils", () => {
  const originalModule = jest.requireActual("../utils");
  return {
    ...originalModule,
    geocoder: {
      geocode: jest.fn(),
    },
  };
});

describe("getBootcampsInRadius Security", () => {
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
    jest.clearAllMocks();
  });

  it("should return a 404 ErrorResponse when geocoder returns empty array", async () => {
    geocoder.geocode.mockResolvedValue([]);

    await getBootcampsInRadius(req, res, next);

    expect(geocoder.geocode).toHaveBeenCalledWith("00000");
    expect(next).toHaveBeenCalledWith(expect.any(ErrorResponse));

    const errorArg = next.mock.calls[0][0];
    expect(errorArg.statusCode).toBe(404);
    expect(errorArg.message).toBe("No location found for zipcode 00000");
  });

  it("should return a 404 ErrorResponse when geocoder returns null or undefined", async () => {
    geocoder.geocode.mockResolvedValue(null);

    await getBootcampsInRadius(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ErrorResponse));

    const errorArg = next.mock.calls[0][0];
    expect(errorArg.statusCode).toBe(404);
    expect(errorArg.message).toBe("No location found for zipcode 00000");
  });
});
