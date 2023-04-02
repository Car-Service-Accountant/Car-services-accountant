const mapErrors = require('../utils/errorMapper');
const { createRepair, updateRepair, deleteRepair } = require('../services/repairServices');

const router = require('express').Router();

router.post("/:carID", async (req, res) => {
    const carID = req.params.carID;
    const service = req.body.service;
    const parts = req.body.parts
    const { priceForLabor, note, createDate, endDate, finished, paied } = req.body;

    const repairData = {
        service: [...service],
        parts: [...parts],
        priceForLabor,
        note,
        createDate,
        endDate,
        finished,
        paied
    }
    try {
        const car = await createRepair(carID, repairData);

        res.status(200).json(car)
    } catch (err) {
        console.error(err.message);
        const error = mapErrors(err);

        res.status(400).json({ message: error })
    }
})

router.patch('/:repairID', (req, res) => {
    const repairID = req.params.repairID;
    const service = req.body.service;
    const parts = req.body.parts
    const { priceForLabor, note, createDate, endDate, finished, paied } = req.body;

    const repairData = {
        service: [...service],
        parts: [...parts],
        priceForLabor,
        note,
        createDate,
        endDate,
        finished,
        paied
    }
    try {
        const car = updateRepair(repairID, repairData);
        res.status(200).json(car);
    } catch (err) {
        console.error(err.message);
        const error = mapErrors(err);

        res.status(400).json({ message: error })
    }
})

router.delete('/:repairID', async (req, res) => {
    const id = req.params.repairID;
    try {
        await deleteRepair(id);
        res.status(200).json({ message: "Successfully delete repair" })
    } catch (err) {
        console.error(err.message);
        const error = mapErrors(err);

        res.status(400).json({ message: error })
    }
})

module.exports = router