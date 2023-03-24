const router = require('express').Router();
const authController = require('../controllers/authController');
const carController = require('../controllers/carController');
const repairController = require('../controllers/repairController');
const userController = require('../controllers/userController')

router.use("/car", carController);
router.use('/user', userController)
router.use("/auth", authController);
router.use('/repair', repairController);
router.all('*', (req, res) => {
    res.status(404)
})


module.exports = router