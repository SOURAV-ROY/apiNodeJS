const express = require('express');
const dotenv = require("dotenv");

//Router Files****************
const bootcamps = require('./routes/bootcamps');

//Load env vars ************
dotenv.config({path: "./config/config.env"});

const app = express();

//Middleware ******************
const logger = (req, res, next) => {
    req.hello = "Hello SOURAV";
    console.log("Middleware RUN");
    next();
};
app.use(logger);

//Mount Routers ******************
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Running in ${process.env.NODE_ENV} Mode on Port ${PORT}`)
})
