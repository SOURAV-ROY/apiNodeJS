const { updateBootcamp, bootcampPhotoUpload } = require("../controllers/bootcampsController");
const { Bootcamp } = require("../models");

jest.mock("../models", () => ({
  Bootcamp: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

describe("Bootcamp Controller - Pre-Update Authorization Optimization", () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      params: { id: "507f1f77bcf86cd799439011" },
      body: { name: "Updated Bootcamp" },
      user: { id: "507f1f77bcf86cd799439012", role: "publisher" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe("updateBootcamp", () => {
    it("should chain .select('user').lean() when querying Bootcamp before updating", async () => {
      const mockUserObj = {
        toString: () => "507f1f77bcf86cd799439012",
      };
      const mockLean = jest.fn().mockResolvedValue({
        _id: "507f1f77bcf86cd799439011",
        user: mockUserObj,
      });
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        lean: mockLean,
      };
      Bootcamp.findById.mockReturnValue(mockQuery);
      Bootcamp.findByIdAndUpdate.mockResolvedValue({
        _id: "507f1f77bcf86cd799439011",
        name: "Updated Bootcamp",
      });

      updateBootcamp(req, res, next);
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(Bootcamp.findById).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
      expect(mockQuery.select).toHaveBeenCalledWith("user");
      expect(mockLean).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("bootcampPhotoUpload", () => {
    it("should chain .select('user').lean() when querying Bootcamp before uploading photo", async () => {
      req.files = {
        file: {
          name: "photo.jpg",
          mimetype: "image/jpeg",
          size: 500000,
          mv: jest.fn().mockImplementation((uploadPath, callback) => callback(null)),
        },
      };

      const mockUserObj = {
        toString: () => "507f1f77bcf86cd799439012",
      };
      const mockLean = jest.fn().mockResolvedValue({
        _id: "507f1f77bcf86cd799439011",
        user: mockUserObj,
      });
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        lean: mockLean,
      };
      Bootcamp.findById.mockReturnValue(mockQuery);
      Bootcamp.findByIdAndUpdate.mockResolvedValue({});

      bootcampPhotoUpload(req, res, next);
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(Bootcamp.findById).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
      expect(mockQuery.select).toHaveBeenCalledWith("user");
      expect(mockLean).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
