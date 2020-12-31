const asyncHandler = sou => (req, res, next) => {
    Promise.resolve(sou(req, res, next)).catch(next);
}
module.exports = asyncHandler;
