const { addReview, updateReview } = require("../controllers/reviewsController");
const { Review, Bootcamp } = require("../models");

jest.mock("../models", () => ({
  Review: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    create: jest.fn(),
  },
  Bootcamp: {
    findById: jest.fn(),
  },
}));

describe("Review Controller - Mass Assignment Security", () => {
  it("should strip user and bootcamp fields from req.body when updating a review", async () => {
    const mockReview = {
      _id: "review123",
      user: "user123",
      bootcamp: "bootcamp123",
      title: "Great Bootcamp",
      text: "Loved every moment of it",
      rating: 9,
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
        bootcamp: "attackerBootcamp789", // Attempted bootcamp re-association
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

  it("should force req.body.user to req.user.id and req.body.bootcamp to req.params.bootcampId when creating a review", async () => {
    Bootcamp.findById.mockResolvedValue({ _id: "bootcamp123" });
    Review.create.mockResolvedValue({
      _id: "review123",
      title: "New Review",
      text: "Great course",
      rating: 8,
      bootcamp: "bootcamp123",
      user: "user123",
    });

    const req = {
      params: { bootcampId: "bootcamp123" },
      user: { id: "user123", role: "user" },
      body: {
        title: "New Review",
        text: "Great course",
        rating: 8,
        user: "attacker456", // Attempted spoofing
        bootcamp: "attackerBootcamp789", // Attempted spoofing
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
      addReview(req, res, next);
    });

    expect(Review.create).toHaveBeenCalledWith({
      title: "New Review",
      text: "Great course",
      rating: 8,
      user: "user123",
      bootcamp: "bootcamp123",
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
