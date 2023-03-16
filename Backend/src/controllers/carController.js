const router = require('express').Router();
const mapErrors = require('../utils/errorMapper');
const { isGuest, isAuth } = require('../middleware/guard');
const { addCar, getCarByID, getAllCars, getCarByInfo } = require('../services/carServices');

router.post("/", async (req, res) => {
    const { Owner, CarNumber, phoneNumber, carModel, carMark } = req.body;
    console.log(Owner, CarNumber, phoneNumber, carModel, carMark);
    try {
        const data = await addCar(Owner, CarNumber, phoneNumber, carModel, carMark);

        res.status(200).json(data)

    } catch (err) {
        console.error(err.message);
        const error = mapErrors(err);
        res.status(400).json({ message: error })
    }
})
router.get('/:mark/:model', async (req, res) => {
    const mark = req.params.mark;
    const model = req.params.model;

    try {
        const data = await getCarByInfo(mark, model);
        res.status(200).json(data);
    } catch (err) {
        console.error(err.message);
        const error = mapErrors(err);
        res.status(404).json({ message: error })
    }
})

router.get("/:carID", async (req, res) => {
    const carID = req.params.carID;
    console.log(carID);

    try {
        const car = await getCarByID(carID);
        res.status(200).json(car);
    } catch (err) {
        console.error(err.message);
        const error = mapErrors(err);
        res.status(404).json({ message: error })
    }
})


router.get("", async (req, res) => {
    try {
        const data = await getAllCars();
        res.status(200).json(data);
    } catch (err) {
        console.error(err.message);
        const error = mapErrors(err);
        res.status(404).json({ message: error })
    }
})

// TODO : think about how to select only model , mark or owner name (probably think what end point to be);

module.exports = router;
