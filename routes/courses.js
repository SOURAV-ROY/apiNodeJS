const express = require('express');

const {
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse
} = require("../controllers/coursesController");

const Course = require("../models/CourseModel");
const advancedResults = require("../middleware/advancedResults");

//Protect Middleware ****************************************************
const router = express.Router({mergeParams: true});

const {protect} = require('../middleware/auth');


router.route('/')
    .get(advancedResults(Course, {
            path: 'bootcamp',
            select: 'name description email phone housing'
        }),
        getCourses)
    .post(protect, addCourse);

router.route('/:id')
    .get(getCourse)
    .put(protect, updateCourse)
    .delete(protect, deleteCourse);

module.exports = router;
