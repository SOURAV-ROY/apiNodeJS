const express = require('express');
const dotenv = require("dotenv");
const logger = require('./middleware/logger');
const morgan = require('morgan');

const connectDB = require('./config/db');

//Load env vars ************
dotenv.config({path: "./config/config.env"});

//Connect To DB************************************
connectDB();

//Router Files****************
const bootcamps = require('./routes/bootcamps');

const app = express();

//Use Middleware ******************
app.use(logger);

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//Mount Routers ******************
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server Running in ${process.env.NODE_ENV} Mode on Port ${PORT}`)
})

//handle unhandled promise rejections
process.on('unhandledRejection', (error, promise) => {
    console.log(`Error: ${error.message}`);

//  Close server and exit process **********
    server.close(() => {
        process.exit(1);
    })
})
