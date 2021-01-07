const mongoose = require('mongoose');
const ErrorResponse = require('../utils/ErrorResponse')
const asyncHandler = require('../middleware/async')
const Course = require("../models/CourseModel");

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
