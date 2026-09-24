const advancedResults = require("../middleware/advancedResults");

describe("advancedResults middleware query sanitization", () => {
  it("should sanitize direct NoSQL query operators ($where, $gt) from query params", async () => {
    // Mock model with chainable methods
    const mockModel = {
      find: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      countDocuments: jest.fn().mockResolvedValue(0),
      exec: jest.fn().mockResolvedValue([]),
    };

    mockModel.then = (resolve) => resolve([]);

    const req = {
      query: {
        $where: "this.password != null",
        price: { $gt: 0 },
        name: "Bootcamp",
      },
    };

    const res = {};
    const next = jest.fn();

    const middleware = advancedResults(mockModel);
    await middleware(req, res, next);

    // Verify model.find was called with sanitized query object ($where stripped, $gt inside price stripped)
    expect(mockModel.find).toHaveBeenCalledWith({
      name: "Bootcamp",
      price: {},
    });
    expect(next).toHaveBeenCalled();
  });

  it("should allow legitimate query filtering with non-dollar comparison syntax (gt, gte, lt, lte, in)", async () => {
    const mockModel = {
      find: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      countDocuments: jest.fn().mockResolvedValue(0),
      exec: jest.fn().mockResolvedValue([]),
    };

    mockModel.then = (resolve) => resolve([]);

    const req = {
      query: {
        price: { gte: "1000" },
      },
    };

    const res = {};
    const next = jest.fn();

    const middleware = advancedResults(mockModel);
    await middleware(req, res, next);

    expect(mockModel.find).toHaveBeenCalledWith({
      price: { $gte: "1000" },
    });
    expect(next).toHaveBeenCalled();
  });

  it("should pass parsedQuery filter to countDocuments", async () => {
    const mockModel = {
      find: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      countDocuments: jest.fn().mockResolvedValue(10),
    };

    mockModel.then = (resolve) => resolve([{ id: 1 }]);

    const req = {
      query: {
        price: { lte: "500" },
      },
    };

    const res = {};
    const next = jest.fn();

    const middleware = advancedResults(mockModel);
    await middleware(req, res, next);

    expect(mockModel.countDocuments).toHaveBeenCalledWith({
      price: { $lte: "500" },
    });
    expect(res.advancedResults).toBeDefined();
    expect(res.advancedResults.total).toBe(10);
    expect(next).toHaveBeenCalled();
  });
});
