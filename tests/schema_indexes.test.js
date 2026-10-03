const Course = require("../models/CourseModel");
const Review = require("../models/ReviewModel");

describe("Mongoose Schema Foreign Key Indexes", () => {
  it("should have index: true configured on CourseSchema bootcamp and user paths", () => {
    expect(Course.schema.path("bootcamp").options.index).toBe(true);
    expect(Course.schema.path("user").options.index).toBe(true);
  });

  it("should have index: true configured on ReviewSchema bootcamp and user paths", () => {
    expect(Review.schema.path("bootcamp").options.index).toBe(true);
    expect(Review.schema.path("user").options.index).toBe(true);
  });
});
