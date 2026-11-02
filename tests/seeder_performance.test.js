const Review = require("../models/ReviewModel");
const Course = require("../models/CourseModel");
const Bootcamp = require("../models/BootcampModel");
const User = require("../models/UserModel");
const { deleteData } = require("../seeder");

describe("Database Seeder Teardown Performance Optimization", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should purge collections concurrently using Promise.all", async () => {
    let activeDeletes = 0;
    let maxConcurrentDeletes = 0;

    const createDeferredDelete = () => {
      return jest.fn().mockImplementation(() => {
        activeDeletes++;
        if (activeDeletes > maxConcurrentDeletes) {
          maxConcurrentDeletes = activeDeletes;
        }
        return new Promise((resolve) => {
          setImmediate(() => {
            activeDeletes--;
            resolve({});
          });
        });
      });
    };

    const reviewSpy = jest
      .spyOn(Review, "deleteMany")
      .mockImplementation(createDeferredDelete());
    const courseSpy = jest
      .spyOn(Course, "deleteMany")
      .mockImplementation(createDeferredDelete());
    const bootcampSpy = jest
      .spyOn(Bootcamp, "deleteMany")
      .mockImplementation(createDeferredDelete());
    const userSpy = jest
      .spyOn(User, "deleteMany")
      .mockImplementation(createDeferredDelete());

    await deleteData();

    expect(reviewSpy).toHaveBeenCalledTimes(1);
    expect(courseSpy).toHaveBeenCalledTimes(1);
    expect(bootcampSpy).toHaveBeenCalledTimes(1);
    expect(userSpy).toHaveBeenCalledTimes(1);

    // If deletes were sequential, maxConcurrentDeletes would be 1.
    // Concurrency ensures all 4 deletes are in flight at the same time.
    expect(maxConcurrentDeletes).toBe(4);
  });
});
