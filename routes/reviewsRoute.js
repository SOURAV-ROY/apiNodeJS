const express = require('express');

const {
    getReviews

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

module.exports = router;
