const { creteBootcamp } = require("../controllers/bootcampsController");
const { Bootcamp } = require("../models");

jest.mock("../models", () => ({
  Bootcamp: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

describe("Bootcamp Controller - Mass Assignment Security on Creation", () => {
  it("should force req.body.user to req.user.id to prevent ownership spoofing during bootcamp creation", async () => {
    const mockQuery = {
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(null),
    };
    Bootcamp.findOne.mockReturnValue(mockQuery);

    const authenticatedUserId = "user_123_authenticated";
    const attackerSpoofedUserId = "user_999_attacker";

    Bootcamp.create.mockResolvedValue({
      _id: "bootcamp_1",
      name: "Security Bootcamp",
      user: authenticatedUserId,
    });

    const req = {
      user: { id: authenticatedUserId, role: "publisher" },
      body: {
        name: "Security Bootcamp",
        description: "Learn AppSec",
        user: attackerSpoofedUserId,
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
      creteBootcamp(req, res, next);
    });

    expect(req.body.user).toBe(authenticatedUserId);
    expect(Bootcamp.create).toHaveBeenCalledWith(
      expect.objectContaining({
        user: authenticatedUserId,
      }),
    );
    expect(res.status).toHaveBeenCalledWith(201);
  });
});
