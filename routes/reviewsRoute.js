const express = require("express");

const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewsController");

const { Review } = require("../models");

const router = express.Router({ mergeParams: true });

const {
  advancedResults,
  protect,
  authorize,
  validate,
} = require("../middleware");

const {
  reviewValidator: { createReviewSchema, updateReviewSchema },
  commonValidator: { idSchema, querySchema },
} = require("../utils/validators");

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
