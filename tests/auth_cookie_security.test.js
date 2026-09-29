const { logout } = require("../controllers/authController");

describe("Auth Controller Cookie Security", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      cookie: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should set secure cookie options on logout (httpOnly, sameSite: strict, path: /)", async () => {
    await logout(req, res, next);

    expect(res.cookie).toHaveBeenCalledWith(
      "token",
      "none",
      expect.objectContaining({
        httpOnly: true,
        sameSite: "strict",
        path: "/",
      }),
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
