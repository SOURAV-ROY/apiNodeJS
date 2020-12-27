const Bootcamp = require("../models/BootcampModel");

// @description     Get all bootcamps
// @route           GET /api/v1/bootcamps
// @access          Public
exports.getBootcamps = (req, res, next) => {
    res.status(200)
        .json({
            success: true,
            msg: "Show All Bootcamps",
            // hello: req.hello
        });
};

// @description     Get single bootcamp
// @route           GET /api/v1/bootcamps/:id
// @access          Public
exports.getBootcamp = (req, res, next) => {
    res.status(200)
        .json({
            success: true,
            msg: `Show a Single Bootcamp ${req.params.id}`
        });
};

// @description     Create new bootcamp
// @route           POST /api/v1/bootcamps
// @access          Private
exports.creteBootcamp = async (req, res, next) => {
    // console.log(req.body);
    // res.status(200)
    //     .json({
    //         success: true,
    //         msg: "Create New Bootcamp"
    //     });
    try {
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({
            success: true,
            data: bootcamp
        });
    } catch (errors) {
        res.status(400).json({success: false});
    }
};

// @description     Update bootcamp
// @route           PUT /api/v1/bootcamps/:id
// @access          Private
exports.updateBootcamp = (req, res, next) => {
    res.status(200)
        .json({
            success: true,
            msg: `Update Bootcamp ${req.params.id}`
        });
};

// @description     Delete bootcamp
// @route           DELETE /api/v1/bootcamps/:id
// @access          Private
exports.deleteBootcamp = (req, res, next) => {
    res.status(200)
        .json({
            success: true,
            msg: `Delete Bootcamp ${req.params.id}`
        });
};
