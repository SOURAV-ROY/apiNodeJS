const { creteBootcamp } = require("../controllers/bootcampsController");
const { Bootcamp } = require("../models");

jest.mock("../models", () => ({
  Bootcamp: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

describe("creteBootcamp Optimization", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: { id: "user123", role: "publisher" },
      body: { name: "Test Bootcamp" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should chain .select('_id') and .lean() on Bootcamp.findOne", async () => {
    const mockQuery = {
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(null),
    };
    Bootcamp.findOne.mockReturnValue(mockQuery);
    Bootcamp.create.mockResolvedValue({ _id: "bootcamp123", name: "Test Bootcamp" });

    await new Promise((resolve) => {
      res.json.mockImplementation(() => resolve());
      next.mockImplementation((err) => resolve(err));
      creteBootcamp(req, res, next);
    });

    expect(Bootcamp.findOne).toHaveBeenCalledWith({ user: "user123" });
    expect(mockQuery.select).toHaveBeenCalledWith("_id");
    expect(mockQuery.lean).toHaveBeenCalled();
    expect(Bootcamp.create).toHaveBeenCalledWith({
      name: "Test Bootcamp",
      user: "user123",
    });
    expect(res.status).toHaveBeenCalledWith(201);
  });
});
