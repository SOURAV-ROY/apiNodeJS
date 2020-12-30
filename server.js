const express = require('express');
const dotenv = require("dotenv");
const logger = require('./middleware/logger');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config_update/db');

//Load env vars ************
dotenv.config({path: "./config_update/config.env"});

//Connect To DB************************************
connectDB();

//Router Files****************
const bootcamps = require('./routes/bootcamps');

const app = express();

//Body Parser ****************
app.use(express.json());

//Use logger Middleware ******************
app.use(logger);

//Use morgan Middleware ******************
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//Mount Routers ******************
app.use('/api/v1/bootcamps', bootcamps);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server Running in ${process.env.NODE_ENV} Mode on Port ${PORT}`.bgGreen.bold.underline)
})

//handle unhandled promise rejections
process.on('unhandledRejection', (error, promise) => {
    console.log(`Error: ${error.message}`.bgRed.bold);

//  Close server and exit process **********
    server.close(() => {
        process.exit(1);
    })
})
