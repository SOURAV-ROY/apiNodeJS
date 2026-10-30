const connectMongo = require("connect-mongo");
const MongoStore =
  connectMongo.default || connectMongo.MongoStore || connectMongo;

describe("MongoStore Integration Test", () => {
  let store;
  const mongoUrl =
    process.env.MONGO_URI_TEST || "mongodb://127.0.0.1:27017/bnodeapi_test";

  beforeAll(() => {
    store = MongoStore.create({
      mongoUrl,
      collectionName: "test_sessions",
      ttl: 60,
    });
  });

  afterAll(async () => {
    if (store) {
      await store.clear();
      await store.close();
    }
  });

  it("should save and retrieve session data using MongoStore", (done) => {
    const sessionId = "test-session-id-12345";
    const sessionData = {
      cookie: { maxAge: 60000, originalMaxAge: 60000 },
      _csrf: "test_csrf_token_secret_abc",
    };

    store.set(sessionId, sessionData, (err) => {
      expect(err).toBeFalsy();

      store.get(sessionId, (getErr, retrieved) => {
        expect(getErr).toBeFalsy();
        expect(retrieved).toBeDefined();
        expect(retrieved._csrf).toBe("test_csrf_token_secret_abc");

        store.destroy(sessionId, (destroyErr) => {
          expect(destroyErr).toBeFalsy();
          done();
        });
      });
    });
  });
});
