const router = require('express').Router();
const mapErrors = require('../utils/errorMapper');
const { register, login } = require('../services/authServices');
const { isGuest, isAuth } = require('../middleware/guard');


router.post('/register', isGuest(), async (req, res) => {
    const {email , username , password , rePassword} = req.body;
    try {
        if (email.trim() == '' || username.trim() == '' || password.trim() == '') {
            throw new Error('all the fields are required');
        }

        const token = await register(email.trim().toLowerCase(),username.trim().toLowerCase(),  password.trim() ,  rePassword.trim());
        res.status(201).json(token)

    } catch (err) {
        console.error(err.message);
        const error = mapErrors(err);
        res.status(400).json({ message: error })
    }
})

router.post('/login', isGuest(), async (req, res) => {
    const {email , passowrd} = req.body;
    try {
        const result = await login(email.trim().toLowerCase(), username.trim().toLowerCase(), password.trim()); // TO MAKE IT SIMPLE
        res.json(result)

    } catch (err) {
        console.error(err.message);
        const error = mapErrors(err);
        res.status(400).json({ message: error })
    }
})

router.get('/logout', isAuth(), (req, res) => {
    res.end();
})
module.exports = router;
