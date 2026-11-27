const mockStoreInstance = {
  get: jest.fn(),
  set: jest.fn(),
  destroy: jest.fn(),
  on: jest.fn(),
  close: jest.fn(),
};

const mockCreate = jest.fn().mockReturnValue(mockStoreInstance);

jest.mock("connect-mongo", () => ({
  create: mockCreate,
  MongoStore: {
    create: mockCreate,
  },
  default: {
    create: mockCreate,
  },
}));

jest.mock("../db", () => jest.fn().mockResolvedValue(true));

describe("Production Session Store Configuration", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    mockCreate.mockClear();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should configure MongoStore in production and NOT emit MemoryStore warning", () => {
    process.env.NODE_ENV = "production";
    process.env.SESSION_SECRET =
      "production_session_secret_32_characters_long!";
    process.env.JWT_SECRET = "production_jwt_secret_32_characters_long!";
    process.env.MONGO_URI = "mongodb://127.0.0.1:27017/bnodeapi_test";

    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    // Import app under production env
    require("../index");

    // Verify MongoStore.create was called with the production MONGO_URI
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        mongoUrl: "mongodb://127.0.0.1:27017/bnodeapi_test",
        collectionName: "sessions",
      }),
    );

    // Verify MemoryStore warning was not emitted
    const memoryStoreWarnings = warnSpy.mock.calls.filter((call) =>
      call.some(
        (arg) =>
          typeof arg === "string" &&
          arg.includes(
            "MemoryStore is not\ndesigned for a production environment",
          ),
      ),
    );

    expect(memoryStoreWarnings.length).toBe(0);
    warnSpy.mockRestore();
  });

  it("should enforce MONGO_URI in production mode", () => {
    const dotenv = require("dotenv");
    dotenv.config = jest.fn();

    process.env.NODE_ENV = "production";
    process.env.SESSION_SECRET =
      "production_session_secret_32_characters_long!";
    process.env.JWT_SECRET = "production_jwt_secret_32_characters_long!";
    delete process.env.MONGO_URI;

    expect(() => {
      require("../index");
    }).toThrow(/MONGO_URI/);
  });
});
