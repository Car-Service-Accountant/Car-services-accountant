const router = require('express').Router();
const authControler = require('./services/authServices.js');


router.use("/auth" , async (req, res) => {
    console.log(req.body);
    const { username, email, password, rePassword } = req.body
    try {
        const token = await register(username, email, password, rePassword);

        res.cookie('auth', token);
        res.redirect('/')
    } catch (error) {
        return res.status(404).render('auth/register', { error: errorParser(error) });
    }
})
router.all('*', (req, res) => {
    res.send("cusstom there")
})


module.exports = router