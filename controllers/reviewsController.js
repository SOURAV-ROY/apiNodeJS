const ErrorResponse = require('../utils/ErrorResponse')
const asyncHandler = require('../middleware/async')
const Review = require("../models/ReviewModel");
const Bootcamp = require("../models/BootcampModel");

// @description     Get Reviews
// @route           GET /api/v1/reviews
// @route           GET /api/v1/bootcamps/:bootcampId/reviews
// @access          Public
exports.getReviews = asyncHandler(async (req, res, next) => {

    if (req.params.bootcampId) {

        const reviews = await Review.find({bootcamp: req.params.bootcampId});

        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } else {
        res.status(200).json(res.advancedResults);
    }

});

// @description     Get Single Reviews
// @route           GET /api/v1/reviews/:id
// @access          Public
exports.getReview = asyncHandler(async (req, res, next) => {

    const review = await Review.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if (!review) {
        return next(new ErrorResponse(`No Review Found With The ID Of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: review
    })
});

// @description     Add Review
// @route           POST /api/v1/bootcamps/:bootcampId/reviews
// @access          Private
exports.addReview = asyncHandler(async (req, res, next) => {

    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
        return next(new ErrorResponse(`No Bootcamp Found With The ID Of ${req.params.bootcampId}`, 404));
    }

    const review = await Review.create(req.body);

    res.status(200).json({
        success: true,
        data: review
    });
});

// @description     Update Review
// @route           PUT /api/v1/reviews/:id
// @access          Private
exports.updateReview = asyncHandler(async (req, res, next) => {

    let review = await Review.findById(req.params.id);

    if (!review) {
        return next(new ErrorResponse(`No Review Found With The ID Of ${req.params.id}`, 404));
    }
    //Make sure review belongs to user or admin **************************************
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Not Authorize To Update Review`, 401));
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: review
    });
});
