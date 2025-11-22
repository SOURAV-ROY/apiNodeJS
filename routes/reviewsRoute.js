const express = require("express");

const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewsController");

const Review = require("../models/ReviewModel");

//Protect Middleware ************************************************
const router = express.Router({ mergeParams: true });

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  createReviewSchema,
  updateReviewSchema,
} = require("../utils/validators/reviewValidator");
const {
  idSchema,
  querySchema,
} = require("../utils/validators/commonValidator");

router
  .route("/")
  .get(
    validate(querySchema, "query"),
    advancedResults(Review, {
      path: "bootcamp",
      select: "name description email phone",
    }),
    getReviews,
  )
  .post(
    protect,
    authorize("admin", "user"),
    validate(createReviewSchema),
    addReview,
  );

router
  .route("/:id")
  .get(validate(idSchema, "params"), getReview)
  .put(
    protect,
    authorize("user", "admin"),
    validate(idSchema, "params"),
    validate(updateReviewSchema),
    updateReview,
  )
  .delete(
    protect,
    authorize("user", "admin"),
    validate(idSchema, "params"),
    deleteReview,
  );

module.exports = router;
