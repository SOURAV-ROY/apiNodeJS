const express = require('express');

const {
    getCourses,
} = require("../controllers/coursesController");

const router = express.Router();


router.get('/', getCourses);

module.exports = router;
