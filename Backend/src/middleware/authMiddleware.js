const { tokenVerify } = require("../services/authServices");

module.exports = () => (req, res, next) => {
    const token = req.headers['x-autorization'];

    try {
        if (token) {
            const userData = tokenVerify(token);
            req.user = userData
        }
        next();
    } catch (err) {
        res.status(498).json({ message: 'Invalid access token. Please sign in'})
    }
}