// @description  -->> Logs Request Console

const logger = (req, res, next) => {
    console.log(`Middleware RUN`.brightCyan.bold);
    console.log(
        `${req.method.red} ${req.protocol.green}://${req.get('host').brightBlue}${req.originalUrl.brightMagenta}`
    );
    next();
};

module.exports = logger;
