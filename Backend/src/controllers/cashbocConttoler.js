const router = require('express').Router();
const { addMonney } = require('../services/cashboxService');
const mapErrors = require('../utils/errorMapper');
const { getCashbox, updateCashBox } = require("../services/cashboxService")

router.get("/:id", async (req, res) => {
    const id = req.params.id
    try {
        const cashBox = await getCashbox(id);
        res.status(200).json(cashBox)
    } catch (err) {
        console.error(err.message);
        const error = mapErrors(err);
        res.status(400).json({ message: error })
    }
})

router.patch("/:id", async (req, res) => {
    const id = req.params.id
    const data = req.body
    try {
        const updatedBox = await updateCashBox(id, data);
        res.status(200).json(updatedBox);
    } catch (err) {
        console.error(err.message);
        const error = mapErrors(err);
        res.status(400).json({ message: error })
    }
})

module.exports = router;
