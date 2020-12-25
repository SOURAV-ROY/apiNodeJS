// @description     Logs request console

const logger = (req, res, next) => {
    // req.hello = "Hello SOURAV";
    console.log("Middleware RUN");
    console.log(
        `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`
    );
    next();
};


module.exports = logger;
