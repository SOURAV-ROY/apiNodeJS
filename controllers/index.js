const authController = require("./authController");
const bootcampsController = require("./bootcampsController");
const coursesController = require("./coursesController");
const reviewsController = require("./reviewsController");
const usersController = require("./usersController");

module.exports = {
  ...authController,
  ...bootcampsController,
  ...coursesController,
  ...reviewsController,
  ...usersController,
};
