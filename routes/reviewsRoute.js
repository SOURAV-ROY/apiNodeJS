const express = require('express');

const {
    getReviews,
    getReview,
    addReview

} = require("../controllers/reviewsController");

const Review = require("../models/ReviewModel");

//Protect Middleware ************************************
const router = express.Router({mergeParams: true});

const advancedResults = require("../middleware/advancedResults");
const {protect, authorize} = require('../middleware/auth');


router.route('/')
    .get(advancedResults(Review, {
            path: 'bootcamp',
            select: 'name description email phone housing'
        }),
        getReviews)
    .post(protect, authorize('admin', 'user'), addReview);

router.route('/:id')
    .get(getReview);

module.exports = router;
