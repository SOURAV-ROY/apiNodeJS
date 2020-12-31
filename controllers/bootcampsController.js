const ErrorResponse = require('../utils/ErrorResponse')
const asyncHandler = require('../middleware/async')
const Bootcamp = require("../models/BootcampModel");

// @description     Get all bootcamps
// @route           GET /api/v1/bootcamps
// @access          Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {

    // try {
    const bootcamps = await Bootcamp.find();

    // if (!bootcamps) {
    //     return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404));
    // }
    res.status(200).json({
        status: true,
        count: bootcamps.length,
        data: bootcamps
    });
    // } catch (errors) {
    //     // res.status(400).json({success: false});
    //     next(errors);
    // }


    // res.status(200)
    //     .json({
    //         success: true,
    //         msg: "Show All Bootcamps",
    //         // hello: req.hello
    //     });
});

// @description     Get single bootcamp
// @route           GET /api/v1/bootcamps/:id
// @access          Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    // try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404));
    }
    res.status(200).json({success: true, data: bootcamp});
    // } catch (errors) {
    //     // res.status(400).json({success: false});
    //     next(errors);
    //     // next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404));
    // }
    // res.status(200)
    //     .json({
    //         success: true,
    //         msg: `Show a Single Bootcamp ${req.params.id}`
    //     });
});

// @description     Create new bootcamp
// @route           POST /api/v1/bootcamps
// @access          Private
exports.creteBootcamp = asyncHandler(async (req, res, next) => {
    // console.log(req.body);
    // res.status(200)
    //     .json({
    //         success: true,
    //         msg: "Create New Bootcamp"
    //     });
    // try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
        success: true,
        data: bootcamp
    });
    // } catch (errors) {
    //     // res.status(400).json({success: false});
    //     next(errors);
    // }
});

// @description     Update bootcamp
// @route           PUT /api/v1/bootcamps/:id
// @access          Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    // try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404));
    }
    res.status(200).json({success: true, data: bootcamp});
    // } catch (errors) {
    //     // res.status(400).json({success: false});
    //     next(errors);
    // }

    // res.status(200)
    //     .json({
    //         success: true,
    //         msg: `Update Bootcamp ${req.params.id}`
    //     });
});

// @description     Delete bootcamp
// @route           DELETE /api/v1/bootcamps/:id
// @access          Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    // try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404));
    }
    res.status(200).json({success: true, data: {}});
    // } catch (errors) {
    //     // res.status(400).json({success: false});
    //     next(errors);
    // }
    // res.status(200)
    //     .json({
    //         success: true,
    //         msg: `Delete Bootcamp ${req.params.id}`
    //     });
});
