const express = require("express");

const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/coursesController");

const Course = require("../models/CourseModel");
const advancedResults = require("../middleware/advancedResults");

// Protect Middleware *******************************************************
const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  createCourseSchema,
  updateCourseSchema,
} = require("../utils/validators/courseValidator");
const {
  idSchema,
  querySchema,
} = require("../utils/validators/commonValidator");

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
