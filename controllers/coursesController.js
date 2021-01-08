const mongoose = require('mongoose');
const ErrorResponse = require('../utils/ErrorResponse')
const asyncHandler = require('../middleware/async')
const Course = require("../models/CourseModel");
const Bootcamp = require("../models/BootcampModel");

// @description     Get all courses
// @route           GET /api/v1/courses
// @route           GET /api/v1/bootcamps/:bootcampId/courses
// @access          Public
exports.getCourses = asyncHandler(async (req, res, next) => {

    let query;

    if (req.params.bootcampId) {
        query = Course.find({bootcamp: req.params.bootcampId});
    } else {
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description housing'
        })
    }

    const courses = await query;

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    });
});

// @description     Get A Single course
// @route           GET /api/v1/course/:id
// @access          Public
exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if (!course) {
        return next(new ErrorResponse(`No Course found with id ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: course
    });
});

// @description     Create New course
// @route           POST /api/v1/bootcamps/:bootcampId/courses
// @access          Private
exports.addCourse = asyncHandler(async (req, res, next) => {

    req.body.bootcamp = req.params.bootcampId;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
        return next(new ErrorResponse(`No Bootcamp found with id ${req.params.bootcampId}`, 404));
    }

    const course = await Course.create(req.body);

    res.status(200).json({
        success: true,
        data: course
    });
});

// @description     Update course
// @route           PUT /api/v1/courses/:id
// @access          Private
exports.updateCourse = asyncHandler(async (req, res, next) => {

    let course = await Course.findById(req.params.id);

    if (!course) {
        return next(new ErrorResponse(`No Course found with id ${req.params.id}`, 404));
    }
    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: course
    });
});

// @description     Delete course
// @route           DELETE /api/v1/courses/:id
// @access          Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {

    const course = await Course.findById(req.params.id);

    if (!course) {
        return next(new ErrorResponse(`No Course found with id ${req.params.id}`, 404));
    }

    await course.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});
