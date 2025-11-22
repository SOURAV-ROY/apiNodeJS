const express = require("express");
const {
  getBootcamps,
  getBootcamp,
  creteBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcampsController");

const { Bootcamp } = require("../models");
const {
  advancedResults,
  protect,
  authorize,
  validate,
} = require("../middleware");

// Include other resource routers ****************************************
const courseRouter = require("./coursesRoute");
const reviewRouter = require("./reviewsRoute");

const router = express.Router();

// Validation Middleware **************************************************
const {
  bootcampValidator: { bootcampSchema },
  commonValidator: { idSchema, querySchema },
} = require("../utils/validators");

// Re-route into other resource routers ***********************************
router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewRouter);

router.get(
  "/radius/:zipcode/:distance",
  validate(querySchema, "query"),
  getBootcampsInRadius,
);

router.get(
  "/",
  validate(querySchema, "query"),
  advancedResults(Bootcamp, "courses"),
  getBootcamps,
);

router.post(
  "/",
  protect,
  authorize("admin", "publisher"),
  validate(bootcampSchema),
  creteBootcamp,
);

router.get("/:id", validate(idSchema, "params"), getBootcamp);

router.put(
  "/:id",
  protect,
  authorize("admin", "publisher"),
  validate(idSchema, "params"),
  validate(bootcampSchema),
  updateBootcamp,
);

router.delete(
  "/:id",
  protect,
  authorize("admin", "publisher"),
  validate(idSchema, "params"),
  deleteBootcamp,
);

router.put(
  "/:id/photo",
  protect,
  authorize("admin", "publisher"),
  validate(idSchema, "params"),
  bootcampPhotoUpload,
);

module.exports = router;

// router.get('/', (req, res) => {
//         // res.send("<h1>Hello Sourav Roy</h1>");
//         // res.send({name: "SOURAV"});
//         // res.json({name: "SOURAV JSON"});
//         // res.sendStatus(401);
//         // res.status(400).json({success: false});
//         // res.status(401).json({success: false});
//         // res.status(200).json({success: true, data: {id: 1, name: "SOURAV"}});
//         res.status(200).json({success: true, msg: "Show All Bootcamps"});
//     }
// );
// router.get('/:id', (req, res) => {
//     res.status(200)
//         .json({
//             success: true,
//             msg: `Show a Single Bootcamp ${req.params.id}`
//         });
// });
//
// router.post('/', (req, res) => {
//     res.status(200)
//         .json({
//             success: true,
//             msg: "Create New Bootcamp"
//         });
// });
//
// router.put('/:id', (req, res) => {
//     res.status(200)
//         .json({success: true, msg: `Update Bootcamp ${req.params.id}`});
// });
//
// router.delete('/:id', (req, res) => {
//     res.status(200)
//         .json({success: true, msg: `Delete Bootcamp ${req.params.id}`});
// });
