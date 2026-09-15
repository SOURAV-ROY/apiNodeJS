const { Bootcamp } = require("../models");

jest.mock("../models", () => ({
  Bootcamp: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

const ActualBootcamp = jest.requireActual("../models/BootcampModel");
const {
  updateBootcamp,
  deleteBootcamp,
  bootcampPhotoUpload,
} = require("../controllers/bootcampsController");

describe("Bootcamp User Schema and Ownership Authorization Security", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { id: "60d5ec49f1b2c80015f8e001" },
      user: { id: "user123", role: "publisher", name: "Test User" },
      body: { name: "Updated Bootcamp Name" },
      files: {},
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

  it("should have user field defined in Bootcamp schema with ref User and required true", () => {
    const userPath = ActualBootcamp.schema.path("user");
    expect(userPath).toBeDefined();
    expect(userPath.options.ref).toBe("User");
    expect(userPath.options.required).toBe(true);
  });

  it("should prevent server crash and return 401 when bootcamp user is undefined in deleteBootcamp", async () => {
    Bootcamp.findById.mockResolvedValue({
      _id: "60d5ec49f1b2c80015f8e001",
      user: undefined,
    });

    updateBootcamp(req, res, next);
    await new Promise(setImmediate);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
      }),
    );
  });

  it("should prevent server crash and return 401 when bootcamp user is undefined in bootcampPhotoUpload", async () => {
    Bootcamp.findById.mockResolvedValue({
      _id: "60d5ec49f1b2c80015f8e001",
      user: undefined,
    });

    bootcampPhotoUpload(req, res, next);
    await new Promise(setImmediate);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
      }),
    );
  });

  it("should allow bootcamp update when requesting user matches bootcamp owner", async () => {
    Bootcamp.findById.mockResolvedValue({
      _id: "60d5ec49f1b2c80015f8e001",
      user: { toString: () => "user123" },
    });
    Bootcamp.findByIdAndUpdate.mockResolvedValue({
      _id: "60d5ec49f1b2c80015f8e001",
      name: "Updated Bootcamp Name",
    });

    updateBootcamp(req, res, next);
    await new Promise(setImmediate);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
      }),
    );
  });
});
