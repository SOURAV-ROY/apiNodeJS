// @description  -->> Logs Request Console

const logger = (req, res, next) => {
    console.log(
        `${req.method.bgMagenta.bold} ${req.protocol.green}://${req.get('host').brightBlue}${req.originalUrl.brightMagenta}`
    );
    next();
};

module.exports = logger;
