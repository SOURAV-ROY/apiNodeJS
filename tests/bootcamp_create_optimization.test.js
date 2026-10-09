const { creteBootcamp } = require("../controllers/bootcampsController");
const { Bootcamp } = require("../models");

jest.mock("../models", () => ({
  Bootcamp: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

describe("Bootcamp Controller - Optimization", () => {
  it("should chain .select('_id').lean() when checking for published bootcamp in creteBootcamp", async () => {
    const mockQuery = {
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(null),
    };
    Bootcamp.findOne.mockReturnValue(mockQuery);
    Bootcamp.create.mockResolvedValue({
      _id: "bootcamp123",
      name: "New Bootcamp",
    });

    const req = {
      user: { id: "user123", role: "publisher" },
      body: { name: "New Bootcamp", address: "123 Main St" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await new Promise((resolve) => {
      res.json.mockImplementation(() => resolve());
      next.mockImplementation((err) => resolve(err));
      creteBootcamp(req, res, next);
    });

    expect(Bootcamp.findOne).toHaveBeenCalledWith({ user: "user123" });
    expect(mockQuery.select).toHaveBeenCalledWith("_id");
    expect(mockQuery.lean).toHaveBeenCalled();
    expect(Bootcamp.create).toHaveBeenCalledWith({
      name: "New Bootcamp",
      address: "123 Main St",
      user: "user123",
    });
    expect(res.status).toHaveBeenCalledWith(201);
  });
});
