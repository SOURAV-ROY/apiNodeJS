const express = require("express");

const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/coursesController");

const { Course } = require("../models");
const {
  advancedResults,
  protect,
  authorize,
  validate,
} = require("../middleware");

const router = express.Router({ mergeParams: true });

const {
  courseValidator: { createCourseSchema, updateCourseSchema },
  commonValidator: { idSchema, querySchema },
} = require("../utils/validators");

router
  .route("/")
  .get(
    validate(querySchema, "query"),
    advancedResults(Course, {
      path: "bootcamp",
      select: "name description email phone housing",
    }),
    getCourses,
  )
  .post(
    protect,
    authorize("admin", "publisher"),
    validate(createCourseSchema),
    addCourse,
  );

router
  .route("/:id")
  .get(validate(idSchema, "params"), getCourse)
  .put(
    protect,
    authorize("admin", "publisher"),
    validate(idSchema, "params"),
    validate(updateCourseSchema),
    updateCourse,
  )
  .delete(
    protect,
    authorize("admin", "publisher"),
    validate(idSchema, "params"),
    deleteCourse,
  );

module.exports = router;
