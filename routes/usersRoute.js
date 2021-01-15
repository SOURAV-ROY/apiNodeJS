const express = require('express');

const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/usersController');

const User = require("../models/UserModel");

//Protect Middleware *******************************************
const router = express.Router({mergeParams: true});

const {protect, authorize} = require('../middleware/auth');
const advancedResults = require("../middleware/advancedResults");

router.use(protect);
router.use(authorize('admin'));

router
    .route('/')
    .get(advancedResults(User), getUsers)
    .post(createUser)

router
    .route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser)

module.exports = router;
