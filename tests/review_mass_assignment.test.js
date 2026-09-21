const { updateReview } = require("../controllers/reviewsController");
const { Review } = require("../models");

jest.mock("../models", () => ({
  Review: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
  Bootcamp: {},
}));

describe("Review Controller - Mass Assignment Security", () => {
  it("should strip user and bootcamp fields from req.body when updating a review", async () => {
    const mockReview = {
      _id: "review123",
      user: "user123",
      bootcamp: "bootcamp123",
      title: "Old Review Title",
      text: "Old Review Text",
    };

    Review.findById.mockResolvedValue(mockReview);
    Review.findByIdAndUpdate.mockResolvedValue({
      ...mockReview,
      title: "Updated Review Title",
    });

    const req = {
      params: { id: "review123" },
      user: { id: "user123", role: "user" },
      body: {
        title: "Updated Review Title",
        user: "attacker456", // Attempted ownership transfer
        bootcamp: "attackerBootcamp789", // Attempted bootcamp association change
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await new Promise((resolve) => {
      res.json.mockImplementation(() => resolve());
      next.mockImplementation((err) => resolve(err));
      updateReview(req, res, next);
    });

    expect(Review.findByIdAndUpdate).toHaveBeenCalledWith(
      "review123",
      { title: "Updated Review Title" },
      { new: true, runValidators: true },
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
