const Review = require("../models/ReviewModel");
const Course = require("../models/CourseModel");
const Bootcamp = require("../models/BootcampModel");
const User = require("../models/UserModel");

jest.mock("../models/ReviewModel", () => ({
  deleteMany: jest.fn(),
}));

jest.mock("../models/CourseModel", () => ({
  deleteMany: jest.fn(),
}));

jest.mock("../models/BootcampModel", () => ({
  deleteMany: jest.fn(),
}));

jest.mock("../models/UserModel", () => ({
  deleteMany: jest.fn(),
}));

const { deleteData } = require("../seeder");

describe("Seeder Performance Optimization (Concurrent Collection Purging)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should purge collections concurrently via Promise.all", async () => {
    let reviewDeleted = false;
    let courseDeleted = false;
    let bootcampDeleted = false;
    let userDeleted = false;

    // Track whether promises execute concurrently rather than strictly waiting serially
    Review.deleteMany.mockImplementation(async () => {
      await new Promise((res) => setTimeout(res, 10));
      reviewDeleted = true;
      return { acknowledged: true };
    });

    Course.deleteMany.mockImplementation(async () => {
      await new Promise((res) => setTimeout(res, 10));
      courseDeleted = true;
      return { acknowledged: true };
    });

    Bootcamp.deleteMany.mockImplementation(async () => {
      await new Promise((res) => setTimeout(res, 10));
      bootcampDeleted = true;
      return { acknowledged: true };
    });

    User.deleteMany.mockImplementation(async () => {
      await new Promise((res) => setTimeout(res, 10));
      userDeleted = true;
      return { acknowledged: true };
    });

    const promiseAllSpy = jest.spyOn(Promise, "all");

    await deleteData();

    expect(promiseAllSpy).toHaveBeenCalled();
    expect(Review.deleteMany).toHaveBeenCalledTimes(1);
    expect(Course.deleteMany).toHaveBeenCalledTimes(1);
    expect(Bootcamp.deleteMany).toHaveBeenCalledTimes(1);
    expect(User.deleteMany).toHaveBeenCalledTimes(1);

    expect(reviewDeleted).toBe(true);
    expect(courseDeleted).toBe(true);
    expect(bootcampDeleted).toBe(true);
    expect(userDeleted).toBe(true);

    promiseAllSpy.mockRestore();
  });
});
