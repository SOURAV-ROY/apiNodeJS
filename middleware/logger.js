// @description     Logs request console

const logger = (req, res, next) => {
    // req.hello = "Hello SOURAV";
    console.log(`Middleware RUN`.brightCyan.bold);
    console.log(
        `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`.brightMagenta.bold
    );
    next();
};

module.exports = logger;
