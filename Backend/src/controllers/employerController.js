const router = require('express').Router();
const mapErrors = require('../utils/errorMapper');
const { getAllEmployers, deleteEmployer } = require('../services/employerServices');

router.get('/employers', async (req, res) => {
    try {
        const data = await getAllEmployers();
        res.status(200).json(data)
    } catch (err) {
        console.error(err.message);
        const error = mapErrors(err);
        res.status(400).json({ message: error })
    }
})

router.delete('/employers/:employerID', async (req, res) => {
    try {
        await deleteEmployer(req.params.employerID);
        res.status(200).json({ message: "Successfuly remove employer" })
    } catch (err) {
        console.error(err.message);
        const error = mapErrors(err);
        res.status(400).json({ message: error })
    }
})
module.exports = router;
