const express = require("express");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/usersController");

const User = require("../models/UserModel");

//Protect Middleware *******************************************
const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");
const validate = require("../middleware/validate");
const {
  createUserSchema,
  updateUserSchema,
} = require("../utils/validators/userValidator");
const {
  idSchema,
  querySchema,
} = require("../utils/validators/commonValidator");

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
