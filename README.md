# NodeJs API

Backend API for the DevCamper application to manage bootcamps, courses, reviews, and users.

## Documentation

The documentation has been split into several files for better organization:

- **[System Design](docs/SYSTEM_DESIGN.md)**: Comprehensive system architecture, design patterns, and technical overview of the project.
- **[Setup and Configuration](docs/SETUP_AND_CONFIGURATION.md)**: Instructions on how to install, configure, and run the project.
- **[API Reference](docs/API_REFERENCE.md)**: Detailed documentation of all API endpoints, including request/response examples.
- **[Project Structure](docs/PROJECT_STRUCTURE.md)**: Explanation of the codebase organization and key directories.
- **[Project Flow](docs/PROJECT_FLOW.md)**: Request lifecycle and data flow diagrams.

## Key Features

- **Bootcamps**: Create, read, update, and delete bootcamps.
- **Courses**: Manage courses associated with bootcamps.
- **Reviews**: Users can review bootcamps.
- **Users & Authentication**: 
    - JWT/Cookie based authentication.
    - User roles (User, Publisher, Admin).
    - Password reset and update profile.
- **Geocoding**: Calculate location and radius for bootcamps.
- **File Upload**: Upload photos for bootcamps.
- **Security**: 
    - Password encryption.
    - Rate limiting.
    - NoSQL injection protection.
    - XSS protection.
    - HPP protection.
    - CORS enabled.

## Quick Start

1.  Clone the repo.
2.  Install dependencies: `npm install`.
3.  Set up `config/config.env` (see [Setup Guide](docs/SETUP_AND_CONFIGURATION.md)).
4.  Run dev server: `npm run dev`.

## License
ISC
