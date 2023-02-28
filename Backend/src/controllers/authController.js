const { isAuth } = require('../middlewares/authMiddleware');
const { register, login } = require('../services/authService');
const { errorParser } = require('../utils/errorParser');

const router = require('express').Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body

    try {
        const token = await login(username, password);

        res.cookie('auth', token);
        res.redirect('/')
    } catch (error) {
        return res.render('auth/login', { error: errorParser(error) });
    }
})


//TODO error handling
router.post('/register', async (req, res) => {
    const { username, email, password, rePassword } = req.body
    try {
        const token = await register(username, email, password, rePassword);

        res.cookie('auth', token);
        res.redirect('/')
    } catch (error) {
        return res.status(404).render('auth/register', { error: errorParser(error) });
    }
})

//logout

//TODO: more abstract and functional after we implement frontend logics
router.get('/logout', isAuth, (req, res) => {
    console.log('logout triggered');
    res.clearCookie('auth');
    res.redirect('/');
})

module.exports = router