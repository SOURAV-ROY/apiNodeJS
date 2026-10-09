const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/auth");
const User = require("../models/UserModel");

jest.mock("../models/UserModel");
jest.mock("jsonwebtoken");

describe("Protect Middleware - Security Checks", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      headers: {},
      cookies: {},
    };
    res = {};
    next = jest.fn();
    jest.clearAllMocks();
    process.env.JWT_SECRET = "testsecret";
  });

  test("should return 401 when no token is present in headers or cookies", async () => {
    await protect(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe("Not Authorized to access this route");
  });

  test("should return 401 when token verification fails (invalid token)", async () => {
    req.headers.authorization = "Bearer invalidtoken";
    jwt.verify.mockImplementation(() => {
      throw new Error("jwt malformed");
    });

    await protect(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe("Not Authorized to access this route");
  });

  test("should return 401 when user in decoded JWT payload is not found in database (session orphaning / deleted user)", async () => {
    req.headers.authorization = "Bearer validtoken";
    jwt.verify.mockReturnValue({ id: "user123" });
    User.findById.mockReturnValue({
      lean: jest.fn().mockResolvedValue(null),
    });

    await protect(req, res, next);

    expect(User.findById).toHaveBeenCalledWith("user123");
    expect(next).toHaveBeenCalledTimes(1);
    const error = next.mock.calls[0][0];
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe("Not Authorized to access this route");
  });

  test("should call next with no error when token is valid and user exists in database", async () => {
    req.headers.authorization = "Bearer validtoken";
    const mockUser = { id: "user123", role: "user" };
    jwt.verify.mockReturnValue({ id: "user123" });
    User.findById.mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockUser),
    });

    await protect(req, res, next);

    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalledWith();
  });
});
