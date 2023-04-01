module.exports = function formatDateMiddleware(req, res, next) {
    const date = req.params.date;
    const formattedDate = formatDate(date);
    req.formattedDate = formattedDate;
    next();
}