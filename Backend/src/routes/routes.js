const router = require('express').Router();
const authController = require('../controllers/authController');
const carController = require('../controllers/carController');
const repairController = require('../controllers/repairController');
const employerController = require('../controllers/employerController')
const cashboxController = require('../controllers/cashbocConttoler');

router.use("/car", carController);
router.use("/auth", authController);
router.use('/repair', repairController);
router.use('/cashbox', cashboxController);
router.use('/employers', employerController)
router.all('*', (req, res) => {
    res.status(404)
})


module.exports = router