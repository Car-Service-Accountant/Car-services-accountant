const mapErrors = require('../utils/errorMapper');
const { createRepair, updateRepair, deleteRepair } = require('../services/repairServices');

const router = require('express').Router();

router.post('/updates', (req, res) => {
    const repairs = req.body;
    console.log("List of repairs ==> ", repairs);
    for (let i = 0; i < repairs.length; i++) {
        const repairID = repairs[i]._id;
        const { service, parts, priceForLabor, note, createDate, endDate, finished, paied } = repairs[i];

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
            updateRepair(repairID, repairData); // Call updateRepair function for the current repair
        } catch (err) {
            console.error(err.message);
            const error = mapErrors(err);
            return res.status(400).json({ message: error });
        }
    }

    res.status(200).json({ message: 'Repairs updated successfully' });
});


module.exports = router