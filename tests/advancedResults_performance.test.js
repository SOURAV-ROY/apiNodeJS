const advancedResults = require("../middleware/advancedResults");

describe("advancedResults Performance & Filter Optimization", () => {
  let req, res, next, mockModel;

  beforeEach(() => {
    req = {
      query: { housing: "true", select: "name,description" },
    };
    res = {};
    next = jest.fn();

    const mockQuery = {
      select: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      then: jest.fn((resolve) => resolve([{ name: "Test Bootcamp" }])),
    };

    mockModel = {
      find: jest.fn().mockReturnValue(mockQuery),
      countDocuments: jest.fn().mockResolvedValue(1),
    };
  });

  it("should run countDocuments with parsed filter query and execute find query concurrently via Promise.all", async () => {
    const middleware = advancedResults(mockModel, "courses");
    await middleware(req, res, next);

    expect(mockModel.find).toHaveBeenCalledWith({ housing: "true" });
    expect(mockModel.countDocuments).toHaveBeenCalledWith({ housing: "true" });
    expect(res.advancedResults).toBeDefined();
    expect(res.advancedResults.total).toBe(1);
    expect(res.advancedResults.count).toBe(1);
    expect(res.advancedResults.data).toEqual([{ name: "Test Bootcamp" }]);
    expect(next).toHaveBeenCalled();
  });
});
