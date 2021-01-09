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

const router = express.Router({mergeParams: true});


router.route('/')
    .get(advancedResults(Course, {
            path: 'bootcamp',
            select: 'name description email phone housing'
        }),
        getCourses)
    .post(addCourse);

router.route('/:id')
    .get(getCourse)
    .put(updateCourse)
    .delete(deleteCourse);

module.exports = router;
