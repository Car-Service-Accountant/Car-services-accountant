const router = require('express').Router();
const authControler = require('../controllers/user');


router.use("/auth" , authControler);
router.all('*', (req, res) => {
    res.send("cusstom there")
})


module.exports = router