const fs = require("fs");
const path = require("path");

describe("Pre-Update Authorization Query Optimization (.select('user').lean())", () => {
  it("should chain .select('user').lean() in updateBootcamp in bootcampsController.js", () => {
    const fileContent = fs.readFileSync(
      path.join(__dirname, "../controllers/bootcampsController.js"),
      "utf8"
    );
    expect(fileContent).toMatch(/bootcampQuery\.select\(["']user["']\)\.lean\(\)/);
  });

  it("should chain .select('user').lean() in bootcampPhotoUpload in bootcampsController.js", () => {
    const fileContent = fs.readFileSync(
      path.join(__dirname, "../controllers/bootcampsController.js"),
      "utf8"
    );
    expect(fileContent).toMatch(/bootcampQuery\.select\(["']user["']\)\.lean\(\)/);
  });

  it("should chain .select('user').lean() in updateCourse in coursesController.js", () => {
    const fileContent = fs.readFileSync(
      path.join(__dirname, "../controllers/coursesController.js"),
      "utf8"
    );
    expect(fileContent).toMatch(/courseQuery\.select\(["']user["']\)\.lean\(\)/);
  });

  it("should chain .select('user').lean() in updateReview in reviewsController.js", () => {
    const fileContent = fs.readFileSync(
      path.join(__dirname, "../controllers/reviewsController.js"),
      "utf8"
    );
    expect(fileContent).toMatch(/reviewQuery\.select\(["']user["']\)\.lean\(\)/);
  });
});
