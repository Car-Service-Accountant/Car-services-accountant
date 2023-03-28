const { tokenVerify } = require("../services/authServices");
// const User = require('../models/User');

module.exports = () => async (req, res, next) => {
    const token = req.headers['x-autorization'];
    if (token) {
        const userData = await tokenVerify(token);
        if (userData) {
            req.user = userData
        } else {
            req.user = null
        }
    }
    next();
}