const router = require('express').Router();
const mapErrors = require('../utils/errorMapper');
const { register, login, registerCompany, loginCompany, renewedToken } = require('../services/authServices');
const { isGuest, isAuth } = require('../middleware/guard');


router.post('/register', isGuest(), async (req, res) => {
    const { email, username, password, rePassword, phoneNumber, role, companyID } = req.body;

    try {
        if (email == '' || username == '' || password == '' || phoneNumber == '') {
            throw new Error('all the fields are required');
        }

        const token = await register(email, username, password, rePassword, phoneNumber, role, companyID);
        res.status(201).json(token)

    } catch (err) {
        console.error(err.message);
        const error = mapErrors(err);
        res.status(400).json({ message: error })
    }
})

router.post('/register/company', isGuest(), async (req, res) => {
    const { email, username, password, rePassword } = req.body;

    try {
        if (email == '' || username == '' || password == '') {
            throw new Error('all the fields are required');
        }

        const token = await registerCompany(email, username, password, rePassword);
        res.status(201).json(token)

    } catch (err) {
        console.error(err.message);
        const error = mapErrors(err);
        res.status(400).json({ message: error })
    }
})

router.post('/login', isGuest(), async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await login(email, password);
        res.status(200).json(token)

    } catch (err) {
        console.error(err.message);
        const error = mapErrors(err);
        res.status(400).json({ message: error })
    }
})

router.post('/login/company', isGuest(), async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await loginCompany(email, password);
        res.json(result)

    } catch (err) {
        console.error(err.message);
        const error = mapErrors(err);
        res.status(400).json({ message: error })
    }
})

// OPTIONAL for advance secure
router.post('/logout', isAuth(), (req, res) => {
    const token = req.headers.authorization || req.cookies.token;
    // Verify the token and extract the employer ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded) {
        res.status(200).json({ message: 'Signout successful' });
    }
    res.status(403).json({ message: "Invalid auth token" })
    // TODO: clear client storage form old token ,so that secure our client was not have problem with login in next request
    // TODO: ways to secure that old token was to use is to set it in blacklist soo that we check every new token is it in blacklist , if have time we would want to do it
})

router.get('/protection', async (req, res) => {
    try {
        const token = await renewedToken(req.user)
        res.status(200).json(token)
    } catch (err) {
        console.error(err.message);
        const error = mapErrors(err);
        res.status(400).json({ message: error })
    }
})

module.exports = router;
