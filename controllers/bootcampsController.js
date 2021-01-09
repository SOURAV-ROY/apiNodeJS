const path = require('path');
const ErrorResponse = require('../utils/ErrorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder');
const Bootcamp = require("../models/BootcampModel");

// @description     Get all bootcamps
// @route           GET /api/v1/bootcamps
// @access          Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {

    res.status(200).json(res.advancedResults);
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
    // const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404));
    }

    //Bootcamp Delete With Courses *************************************
    bootcamp.remove();

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

// @description     Get bootcamps with radious
// @route           GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access          Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const {zipcode, distance} = req.params;

    // get latitude/ longitude from geocoder
    const loc = await geocoder.geocode(zipcode);
    const latitude = loc[0].latitude;
    const longitude = loc[0].longitude;

//    Calc radius using radius
//    Divided dist by radius of earth
//    Earth Radius = 3963 miles / 6378 km
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find(
        {
            location: {$geoWithin: {$centerSphere: [[longitude, latitude], radius]}}
        });
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });
});

// @description     Upload Photo For bootcamp
// @route           PUT /api/v1/bootcamps/:id/photo
// @access          Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404));
    }

    if (!req.files) {
        return next(new ErrorResponse(`Please Upload A File`, 400));
    }
    console.log(req.files);

    const file = req.files.file;

//Make Sure thee image is photo ***********************************************************
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please Upload An Image File`, 400));
    }

//Check File Size *************************************************************************
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please Upload An Image Less Than ${process.env.MAX_FILE_UPLOAD}`, 400));
    }

//Create Custom FileName*******************************************************************
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
    await file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async error => {
        if (error) {
            console.log(error);
            return next(new ErrorResponse(`Problem With File Upload`, 500));
        }
        await Bootcamp.findByIdAndUpdate(req.params.id, {photo: file.name});

        res.status(200).json({
            success: true,
            data: file.name
        })
    });
    console.log(file.name);
});
