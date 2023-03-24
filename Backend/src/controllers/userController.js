const router = require('express').Router();
const mapErrors = require('../utils/errorMapper');
const { getAllUsers } = require('../services/userServices');

router.get('/employers', async (req, res) => {
    try {
        const data = await getAllUsers();
        res.json(data)
    } catch (err) {
        console.error(err.message);
        const error = mapErrors(err);
        res.status(400).json({ message: error })
    }
})

module.exports = router;
