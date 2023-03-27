const { tokenVerify } = require("../services/authServices");
// const Employers = require('../models/Employers');

module.exports = () => async (req, res, next) => {
    const token = req.headers['x-autorization'];

    try {
        if (token) {
            const employersData = await tokenVerify(token);
            // const employers = findOne(employersData._id);
            req.employers = employersData
        }
        next();
    } catch (err) {
        res.status(498).json({ message: 'Invalid access token. Please sign in' })
    }
}