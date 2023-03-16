const { tokenVerify } = require("../services/authServices");
// const User = require('../models/User');

module.exports = () => async (req, res, next) => {
    const token = req.headers['x-autorization'];

    try {
        if (token) {
            const userData = await tokenVerify(token);
            // const user = findOne(userData._id);
            req.user = userData
        }
        next();
    } catch (err) {
        res.status(498).json({ message: 'Invalid access token. Please sign in'})
    }
}