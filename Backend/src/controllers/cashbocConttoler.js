const router = require('express').Router();
const { addMonney } = require('../services/cashboxService');
const mapErrors = require('../utils/errorMapper');

router.post("/", async (req, res) => {
    const data = req.body;
    console.log(req.body);
    try {
        const transaction = await addMonney(data);
        console.log(data);
        res.status(200).json(data)
    } catch (err) {
        console.error(err.message);
        const error = mapErrors(err);
        res.status(400).json({ message: error })
    }
})

module.exports = router;
