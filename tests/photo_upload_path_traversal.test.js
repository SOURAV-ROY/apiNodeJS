const path = require("path");
const { bootcampPhotoUpload } = require("../controllers/bootcampsController");
const Bootcamp = require("../models/BootcampModel");

jest.mock("../models/BootcampModel");

describe("Bootcamp Photo Upload Path Traversal Prevention", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { id: "60d5ec49f1b2c80015f8e001" },
      user: { id: "user123", role: "user" },
      files: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    process.env.MAX_FILE_UPLOAD = 1000000;
    process.env.FILE_UPLOAD_PATH = "./public/uploads";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should sanitize filename with path traversal sequences and extract the correct extension", async () => {
    Bootcamp.findById.mockResolvedValue({
      _id: "60d5ec49f1b2c80015f8e001",
      user: { toString: () => "user123" },
    });
    Bootcamp.findByIdAndUpdate.mockResolvedValue({});

    const mockMv = jest.fn((uploadPath, cb) => cb(null));

    req.files = {
      file: {
        name: "../../../etc/passwd.png",
        mimetype: "image/png",
        size: 1000,
        mv: mockMv,
      },
    };

    await bootcampPhotoUpload(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(mockMv).toHaveBeenCalledWith(
      "./public/uploads/photo_60d5ec49f1b2c80015f8e001.png",
      expect.any(Function),
    );
  });
});
