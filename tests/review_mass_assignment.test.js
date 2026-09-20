const { updateReview } = require("../controllers/reviewsController");
const { Review } = require("../models");

jest.mock("../models", () => ({
  Review: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
  Bootcamp: {},
}));

describe("Review Mass Assignment Protection", () => {
  it("should delete 'user' and 'bootcamp' fields from req.body when updating a review", async () => {
    const mockReview = {
      _id: "review123",
      user: "user123",
      bootcamp: "bootcamp123",
    };

    Review.findById.mockResolvedValue(mockReview);
    Review.findByIdAndUpdate.mockResolvedValue({
      _id: "review123",
      title: "Updated Title",
      text: "Updated text",
    });

    const req = {
      params: { id: "review123" },
      user: { id: "user123", role: "user" },
      body: {
        title: "Updated Title",
        text: "Updated text",
        user: "attacker_user_id",
        bootcamp: "attacker_bootcamp_id",
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

    expect(req.body.user).toBeUndefined();
    expect(req.body.bootcamp).toBeUndefined();
    expect(Review.findByIdAndUpdate).toHaveBeenCalledWith(
      "review123",
      {
        title: "Updated Title",
        text: "Updated text",
      },
      {
        new: true,
        runValidators: true,
      },
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
