const { Bootcamp } = require("../models");
const { creteBootcamp } = require("../controllers/bootcampsController");

jest.mock("../models", () => {
  const mockSelect = jest.fn();
  const mockLean = jest.fn();
  const mockFindOne = jest.fn(() => ({
    select: mockSelect,
  }));
  mockSelect.mockReturnValue({ lean: mockLean });
  mockLean.mockResolvedValue(null);

  return {
    Bootcamp: {
      findOne: mockFindOne,
      create: jest.fn().mockResolvedValue({ _id: "bootcamp123" }),
    },
  };
});

describe("creteBootcamp published check optimization", () => {
  it("should select only _id and chain .lean() on Bootcamp.findOne", async () => {
    const req = {
      user: { id: "user123", role: "publisher" },
      body: { name: "Test Bootcamp" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await creteBootcamp(req, res, next);

    expect(Bootcamp.findOne).toHaveBeenCalledWith({ user: "user123" });
    const selectQuery = Bootcamp.findOne.mock.results[0].value;
    expect(selectQuery.select).toHaveBeenCalledWith("_id");
    const leanQuery = selectQuery.select.mock.results[0].value;
    expect(leanQuery.lean).toHaveBeenCalled();
  });
});
