# Project Structure

This document explains the organization of the codebase and the purpose of each directory.

## Directory Overview

```
.
├── config/             # Configuration files (DB connection, etc.)
├── controllers/        # Route controllers (request logic)
├── db/                 # Database related scripts
├── docs/               # Project documentation
├── middleware/         # Custom Express middleware
├── models/             # Mongoose models (Database schemas)
├── routes/             # API route definitions
├── scripts/            # Utility scripts
├── tests/              # Test files
├── utils/              # Helper utilities (Geocoder, Email, etc.)
├── index.js            # Entry point of the application
└── package.json        # Project dependencies and scripts
```

## Key Directories

### `models/`
Contains Mongoose schemas for MongoDB collections.
- `BootcampModel.js`: Schema for Bootcamps.
- `CourseModel.js`: Schema for Courses.
- `ReviewModel.js`: Schema for Reviews.
- `UserModel.js`: Schema for Users.

### `controllers/`
Contains the logic for handling requests. Each controller file corresponds to a resource.
- `bootcampsController.js`: Logic for bootcamp routes.
- `coursesController.js`: Logic for course routes.
- `authController.js`: Logic for authentication.
- `usersController.js`: Logic for user management.
- `reviewsController.js`: Logic for reviews.

### `routes/`
Defines the API endpoints and maps them to controller functions.
- `bootcamps.js`
- `courses.js`
- `auth.js`
- `users.js`
- `reviews.js`

### `middleware/`
Custom middleware functions.
- `auth.js`: Authentication middleware (protect routes, authorize roles).
- `error.js`: Global error handler.
- `advancedResults.js`: Middleware for pagination, filtering, and sorting.
- `logger.js`: Request logging.

### `utils/`
Helper functions and classes.
- `ErrorResponse.js`: Custom error class.
- `geocoder.js`: Geocoding utility.
- `sendMail.js`: Email sending utility.

### `config/`
- `db.js`: Database connection logic.
