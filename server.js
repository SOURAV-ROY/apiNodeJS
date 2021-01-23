const path = require('path');
const express = require('express');
const dotenv = require("dotenv");
const logger = require('./middleware/logger');
const morgan = require('morgan');
const colors = require('colors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const expressRateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const errorHandler = require('./middleware/error');
const connectDB = require('./config_update/db');

//Load env vars *******************************************************
dotenv.config({path: "./config_update/config.env"});

//Connect To DB********************************************************
connectDB();

//Router Files**********************************************************
const bootcamps = require('./routes/bootcampsRoute');
const courses = require('./routes/coursesRoute');
const auth = require('./routes/authRoute');
const users = require('./routes/usersRoute');
const reviews = require('./routes/reviewsRoute');

const app = express();

//Body Parser **********************************************************
app.use(express.json());

//Cookie Parser ********************************************************
app.use(cookieParser());

//Use logger Middleware ************************************************
app.use(logger);

//Use morgan Middleware *************************************************
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//File Uploading *******************************************************
app.use(fileUpload());

// Sanitize Data *******************************************************
app.use(mongoSanitize());

//Set Security Headers ************************************************
app.use(helmet());

// Prevent XSS attacks ************************************************
app.use(xssClean());

//Rate Limiting ******************************************************
const limiter = expressRateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100
});
app.use(limiter);

//Prevent http params pollution **************************************
app.use(hpp());

//Enable CORS ********************************************************
app.use(cors());

//Set Static Folder ****************************************************
app.use(express.static(path.join(__dirname, 'public')));

//Mount Routers *********************************************************
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

//Add Error Handler *****************************************************
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server Running in ${process.env.NODE_ENV} Mode on Port ${PORT}`.green.bold.inverse)
})

//handle unhandled promise rejections ************************************
process.on('unhandledRejection', (error, promise) => {
    console.log(`Error: ${error.message}`.bgRed.bold);

//  Close server and exit process *****************************************
    server.close(() => {
        process.exit(1);
    })
})
