const express = require('express');
const {
    getBootcamps,
    getBootcamp,
    creteBootcamp,
    updateBootcamp,
    deleteBootcamp
} = require("../controllers/bootcampsController");

const router = express.Router();

router.get('/', getBootcamps);
router.post('/', creteBootcamp);

router.get('/:id', getBootcamp);
router.put('/:id', updateBootcamp);
router.delete('/:id', deleteBootcamp);

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