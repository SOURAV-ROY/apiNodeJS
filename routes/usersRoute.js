const express = require("express");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/usersController");

const { User } = require("../models");

const router = express.Router({ mergeParams: true });

const {
  protect,
  authorize,
  advancedResults,
  validate,
} = require("../middleware");

const {
  userValidator: { createUserSchema, updateUserSchema },
  commonValidator: { idSchema, querySchema },
} = require("../utils/validators");

router.use(protect);
router.use(authorize("admin"));

router
  .route("/")
  .get(validate(querySchema, "query"), advancedResults(User), getUsers)
  .post(validate(createUserSchema), createUser);

router
  .route("/:id")
  .get(validate(idSchema, "params"), getUser)
  .put(validate(idSchema, "params"), validate(updateUserSchema), updateUser)
  .delete(validate(idSchema, "params"), deleteUser);

module.exports = router;
