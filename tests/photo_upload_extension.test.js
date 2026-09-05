const { bootcampPhotoUpload } = require("../controllers/bootcampsController");
const { Bootcamp } = require("../models");
const ErrorResponse = require("../utils/ErrorResponse");

jest.mock("../models", () => ({
  Bootcamp: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn().mockResolvedValue({}),
  },
}));

describe("Bootcamp Photo Upload File Extension Validation", () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      params: { id: "60d5ec49f1b2c80015f8e001" },
      user: {
        id: "5d7a514b5d2c12c7449be042",
        role: "publisher",
        name: "Publisher User",
      },
      files: null,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should reject files with invalid extensions (e.g. .php, .html, .svg) even if mimetype is image/png", async () => {
    Bootcamp.findById.mockResolvedValue({
      _id: "60d5ec49f1b2c80015f8e001",
      user: { toString: () => "5d7a514b5d2c12c7449be042" },
    });

    req.files = {
      file: {
        name: "malicious.php",
        mimetype: "image/png", // Forged MIME type
        size: 1000,
      },
    };

    await bootcampPhotoUpload(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(ErrorResponse);
    expect(error.statusCode).toBe(400);
    expect(error.message).toContain(
      "Please Upload A Valid Image File Extension",
    );
  });

  it("should accept valid image extension .png", async () => {
    Bootcamp.findById.mockResolvedValue({
      _id: "60d5ec49f1b2c80015f8e001",
      user: { toString: () => "5d7a514b5d2c12c7449be042" },
    });

    const fileMoveMock = jest.fn((dest, cb) => cb(null));
    req.files = {
      file: {
        name: "test_image.png",
        mimetype: "image/png",
        size: 1000,
        mv: fileMoveMock,
      },
    };

    process.env.MAX_FILE_UPLOAD = "1000000";
    process.env.FILE_UPLOAD_PATH = "./public/uploads";

    await bootcampPhotoUpload(req, res, next);

    expect(next).not.toHaveBeenCalledWith(expect.any(ErrorResponse));
    expect(fileMoveMock).toHaveBeenCalled();
    const destinationPath = fileMoveMock.mock.calls[0][0];
    expect(destinationPath).not.toContain("..");
    expect(destinationPath).toContain("photo_60d5ec49f1b2c80015f8e001.png");
  });

  it("should sanitize file name to prevent path traversal when bootcamp _id or ext contains path traversal sequences", async () => {
    Bootcamp.findById.mockResolvedValue({
      _id: "../../../etc/passwd",
      user: { toString: () => "5d7a514b5d2c12c7449be042" },
    });

    const fileMoveMock = jest.fn((dest, cb) => cb(null));
    req.files = {
      file: {
        name: "test.png",
        mimetype: "image/png",
        size: 1000,
        mv: fileMoveMock,
      },
    };

    process.env.MAX_FILE_UPLOAD = "1000000";
    process.env.FILE_UPLOAD_PATH = "./public/uploads";

    await bootcampPhotoUpload(req, res, next);

    expect(fileMoveMock).toHaveBeenCalled();
    const destinationPath = fileMoveMock.mock.calls[0][0];
    expect(destinationPath).not.toContain("../../../etc");
    expect(destinationPath).toBe(require("path").join("./public/uploads", "passwd.png"));
  });
});
