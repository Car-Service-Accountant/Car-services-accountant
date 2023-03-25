const router = require('express').Router();
const mapErrors = require('../utils/errorMapper');
const { getAllUsers, deleteUser } = require('../services/userServices');

router.get('/employers', async (req, res) => {
    try {
        const data = await getAllUsers();
        res.status(200).json(data)
    } catch (err) {
        console.error(err.message);
        const error = mapErrors(err);
        res.status(400).json({ message: error })
    }
})

router.delete('/employers/:userID', async (req, res) => {
    try {
        await deleteUser(req.params.userID);
        res.status(200).json({ message: "Successfuly remove user" })
    } catch (err) {
        console.error(err.message);
        const error = mapErrors(err);
        res.status(400).json({ message: error })
    }
})
module.exports = router;
