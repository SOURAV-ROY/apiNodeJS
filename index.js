const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
// const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
// const xssClean = require("xss-clean");
const expressRateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const lusca = require("lusca");
const session = require("express-session");
require("colors");

// Internal Imports *****************************************************
const logger = require("./middleware/logger");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const errorHandler = require("./middleware/error");
const connectDB = require("./db/db");

//Load env vars *******************************************************
// dotenv.config({path: "./config/config.env"});
dotenv.config();

//Connect To DB********************************************************
connectDB().then(() => {
  console.log(`Connected to MongoDB`.bgGreen.bold);
});

//Router Files**********************************************************
const bootcamps = require("./routes/bootcampsRoute");
const courses = require("./routes/coursesRoute");
const auth = require("./routes/authRoute");
const users = require("./routes/usersRoute");
const reviews = require("./routes/reviewsRoute");

const app = express();

//Body Parser **********************************************************
app.use(express.json());

// Fix: Trust proxy (add this line)
app.set("trust proxy", true);

//Cookie Parser ********************************************************
app.use(cookieParser());

//Use logger Middleware ************************************************
app.use(logger);

//Use morgan Middleware *************************************************
if (process.env.NODE_ENV === "development") {
  app.use(morgan("short"));
}

//File Uploading *******************************************************
app.use(fileUpload());

// Sanitize Data *******************************************************
// app.use(mongoSanitize());

//Set Security Headers ************************************************
app.use(helmet());

// Prevent XSS attacks ************************************************
// app.use(xssClean());

//Rate Limiting ******************************************************
const limiter = expressRateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
  // Add this to acknowledge you understand the security implications
  trustProxy: true,

  // Optional: Use a custom key generator that combines IP with other identifiers
  keyGenerator: (req) => {
    return req?.ip + "-" + (req.headers["x-forwarded-for"] || "");
  },
});
app.use(limiter);

//Prevent http params pollution **************************************
app.use(hpp());

//Enable CORS ********************************************************
app.use(cors());

// Set up session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  }),
);

// CSRF Protection *****************************************************
// app.use(lusca.csrf());

//Set Static Folder ****************************************************
app.use(express.static(path.join(__dirname, "public")));

// Home Page
app.get("/", (req, res) => {
  res.send("<h1>Bootcamp Home Page</h1>");
});
//Mount Routers *********************************************************
//Mount Routers *********************************************************
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

// Swagger UI ***********************************************************
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Add Error Handler *****************************************************
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server Running in ${process.env.NODE_ENV} Mode on Port ${PORT}`.green.bold
      .inverse,
  );
});

//handle unhandled promise rejections ************************************
process.on("unhandledRejection", (error) => {
  console.log(`Error: ${error.message}`.bgRed.bold);

  //  Close server and exit process *****************************************
  server.close(() => {
    process.exit(1);
  });
});

// const path = require("path");
// const express = require("express");
// const dotenv = require("dotenv");
// const morgan = require("morgan");
// const helmet = require("helmet");
// const expressRateLimit = require("express-rate-limit");
// const hpp = require("hpp");
// const cors = require("cors");
// const lusca = require("lusca");
// const cookieParser = require("cookie-parser");
// const fileUpload = require("express-fileupload");
// require("colors");
//
// // Internal Imports
// const logger = require("./middleware/logger");
// const errorHandler = require("./middleware/error");
// const connectDB = require("./db/db");
//
// // Router Files
// const bootcamps = require("./routes/bootcampsRoute");
// const courses = require("./routes/coursesRoute");
// const auth = require("./routes/authRoute");
// const users = require("./routes/usersRoute");
// const reviews = require("./routes/reviewsRoute");
//
// // Load env vars first
// dotenv.config();
//
// const app = express();
//
// // Trust proxy configuration
// app.set("trust proxy", 1);
//
// // Security middleware (applied early)
// app.use(helmet({
//     contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
//     crossOriginEmbedderPolicy: false
// }));
//
// // CORS configuration
// const corsOptions = {
//     origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true,
//     credentials: true,
//     optionsSuccessStatus: 200
// };
// app.use(cors(corsOptions));
//
// // Rate limiting (applied early for security)
// const limiter = expressRateLimit({
//     windowMs: 10 * 60 * 1000, // 10 minutes
//     max: process.env.RATE_LIMIT_MAX || 100,
//     trustProxy: true,
//     standardHeaders: true,
//     legacyHeaders: false,
//     keyGenerator: (req) => req.ip,
//     message: {
//         error: "Too many requests from this IP, please try again later"
//     }
// });
// app.use(limiter);
//
// // Body parsing middleware
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));
//
// // Cookie parser
// app.use(cookieParser());
//
// // HTTP parameter pollution prevention
// app.use(hpp({
//     whitelist: ['sort', 'fields', 'page', 'limit'] // Allow common query params
// }));
//
// // CSRF Protection (conditional)
// if (process.env.NODE_ENV === 'production') {
//     app.use(lusca.csrf({
//         cookie: {
//             name: '_csrf',
//             httpOnly: true,
//             secure: true,
//             sameSite: 'strict'
//         }
//     }));
// }
//
// // Logging middleware
// if (process.env.NODE_ENV === 'development') {
//     app.use(morgan('dev'));
//     app.use(logger);
// } else {
//     app.use(morgan('combined'));
// }
//
// // File upload middleware
// app.use(fileUpload({
//     limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
//     abortOnLimit: true,
//     tempFileDir: path.join(__dirname, 'temp'),
//     useTempFiles: true
// }));
//
// // Static files
// app.use(express.static(path.join(__dirname, "public"), {
//     maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0
// }));
//
// // Health check endpoint
// app.get('/health', (req, res) => {
//     res.status(200).json({
//         status: 'OK',
//         timestamp: new Date().toISOString(),
//         uptime: process.uptime(),
//         environment: process.env.NODE_ENV
//     });
// });
//
// // API routes
// const apiRouter = express.Router();
// apiRouter.use("/bootcamps", bootcamps);
// apiRouter.use("/courses", courses);
// apiRouter.use("/auth", auth);
// apiRouter.use("/users", users);
// apiRouter.use("/reviews", reviews);
//
// app.use("/api/v1", apiRouter);
//
// // Home route
// app.get("/", (req, res) => {
//     res.json({
//         name: "Bootcamp API",
//         version: "1.0.0",
//         description: "API for managing bootcamps and courses"
//     });
// });
//
// // 404 handler
// app.use("*", (req, res) => {
//     res.status(404).json({
//         success: false,
//         error: "Route not found"
//     });
// });
//
// // Error handler (must be last)
// app.use(errorHandler);
//
// // Database connection
// const startServer = async () => {
//     try {
//         await connectDB();
//         console.log(`Connected to MongoDB`.bgGreen.bold);
//
//         const PORT = process.env.PORT || 5000;
//         const server = app.listen(PORT, () => {
//             console.log(
//                 `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.green.bold.inverse
//             );
//         });
//
//         // Graceful shutdown handlers
//         const gracefulShutdown = (signal) => {
//             console.log(`${signal} received. Starting graceful shutdown...`.yellow);
//
//             server.close((err) => {
//                 if (err) {
//                     console.error('Error during server shutdown:', err);
//                     process.exit(1);
//                 }
//
//                 console.log('Server closed successfully'.green);
//                 process.exit(0);
//             });
//
//             // Force close after 10 seconds
//             setTimeout(() => {
//                 console.error('Could not close connections in time, forcefully shutting down');
//                 process.exit(1);
//             }, 10000);
//         };
//
//         // Handle shutdown signals
//         process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
//         process.on('SIGINT', () => gracefulShutdown('SIGINT'));
//
//         // Handle unhandled promise rejections
//         process.on("unhandledRejection", (err) => {
//             console.log(`Unhandled Promise Rejection: ${err.message}`.bgRed.bold);
//             gracefulShutdown('unhandledRejection');
//         });
//
//         // Handle uncaught exceptions
//         process.on('uncaughtException', (err) => {
//             console.log(`Uncaught Exception: ${err.message}`.bgRed.bold);
//             gracefulShutdown('uncaughtException');
//         });
//
//     } catch (error) {
//         console.error(`Failed to start server: ${error.message}`.bgRed.bold);
//         process.exit(1);
//     }
// };
//
// // Start the server
// startServer();
//
// module.exports = app;
