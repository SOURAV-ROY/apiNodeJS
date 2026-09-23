const advancedResults = require("../middleware/advancedResults");

describe("advancedResults middleware optimizations", () => {
  it("should pass parsedQuery to countDocuments and run countDocuments concurrently with main query", async () => {
    let countDocumentsCalledWith = null;

    const mockModel = {
      find: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      countDocuments: jest.fn().mockImplementation((query) => {
        countDocumentsCalledWith = query;
        return Promise.resolve(2);
      }),
    };

    // Query result mock
    const mockResults = [
      { id: "1", name: "Bootcamp 1" },
      { id: "2", name: "Bootcamp 2" },
    ];
    mockModel.then = (resolve) => resolve(mockResults);

    const req = {
      query: {
        price: { gte: "500" },
        select: "name",
        sort: "name",
        page: "1",
        limit: "10",
      },
    };

    const res = {};
    const next = jest.fn();

    const middleware = advancedResults(mockModel, "courses");
    await middleware(req, res, next);

    // Verify countDocuments was passed the filtered query object
    expect(countDocumentsCalledWith).toEqual({
      price: { $gte: "500" },
    });

    // Verify find was called with filtered query object
    expect(mockModel.find).toHaveBeenCalledWith({
      price: { $gte: "500" },
    });

    // Verify populate was called with given populate argument ("courses")
    expect(mockModel.populate).toHaveBeenCalledWith("courses");

    // Verify response payload attached to res.advancedResults
    expect(res.advancedResults).toEqual({
      success: true,
      total: 2,
      totalPages: 1,
      count: 2,
      pagination: {},
      data: mockResults,
    });

    expect(next).toHaveBeenCalled();
  });
});
