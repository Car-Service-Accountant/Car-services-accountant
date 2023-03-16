const router = require('express').Router();
const authControler = require('../controllers/userController');
const carController = require('../controllers/carController');

router.use("/car", carController)
router.use("/auth", authControler);
// router.use("/car" , )
router.all('*', (req, res) => {
    res.status(404).send("404 page")
})


module.exports = router