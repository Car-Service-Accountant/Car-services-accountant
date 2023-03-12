const router = require('express').Router();
const mapErrors = require('../utils/errorMapper');
const { register, login , createSession} = require('../services/authServices');
const { isGuest, isAuth } = require('../middleware/guard');

router.post('/register', isGuest(), async (req, res) => {
    console.log(req.body);
    const [email , username , password , rePasword] = req.body;
    try {
        if (email.trim() == '' || username.trim() == '' || password.trim() == '') {
            throw new Error('all the fields are required');
        }

        const result = await register(email.trim().toLowerCase(), password.trim());
        console.log(result);
        res.status(201).json(result)

    } catch (err) {
        console.error(err.message);
        const error = mapErrors(err);
        res.status(400).json({ message: error })
    }
})

router.post('/login', isGuest(), async (req, res) => {
    console.log(req.body);
    const [email , passowrd] = req.body;
    try {
        const result = await login(email.trim().toLowerCase(), username.trim().toLowerCase(), password.trim()); // TO MAKE IT SIMPLE
        console.log(result);
        res.json(result)

    } catch (err) {
        console.error(err.message);
        const error = mapErrors(err);
        res.status(400).json({ message: error })
    }
    return createSession(user);
})

router.get('/logout', isAuth(), (req, res) => {
    console.log(`logout`);
    res.end();
})
module.exports = router;
