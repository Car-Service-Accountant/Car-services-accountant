const router = require('express').Router();
const mapErrors = require('../utils/errorMapper');
const { getAllEmployers, deleteEmployer, getCurrentEmployer, updateEmployer, getEmployerById } = require('../services/employerServices');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
    try {
        const data = await getAllEmployers();
        res.status(200).json(data)
    } catch (err) {
        console.error(err.message);
        const error = mapErrors(err);
        res.status(400).json({ message: error })
    }
})

router.get('/:empId', async (req, res) => {
    const id = req.params.empId;
    try {
        const data = await getEmployerById(id);
        res.status(200).json(data);
    } catch (err) {
        console.error(err.message);
        const error = mapErrors(err);
        res.status(400).json({ message: error })
    }
})

router.delete('/:employerID', async (req, res) => {
    try {
        await deleteEmployer(req.params.employerID);
        res.status(200).json({ message: "Successfuly remove employer" })
    } catch (err) {
        console.error(err.message);
        const error = mapErrors(err);
        res.status(400).json({ message: error })
    }
})
router.post('/:employerID', async (req, res) => {
    try {
        const { email, username, phoneNumber, oldPassword, password, role } = req.body;
        const employerID = req.params.employerID
        if (password !== "" && oldPassword !== "" && password !== undefined && oldPassword !== undefined) {
            const data = {
                email, username, phoneNumber, password, role
            }
            const employer = await getCurrentEmployer(employerID)
            const isValid = await bcrypt.compare(oldPassword, employer.password);
            if (!isValid) {
                throw new Error('Invalid password')
            }
            await updateEmployer(employerID, data)
        } else {
            const data = {
                email, username, phoneNumber, role
            }
            await updateEmployer(employerID, data)
        }
        res.status(200).json({ message: "Succsessfull update" })
    } catch (err) {
        console.error(err.message);
        const error = mapErrors(err);
        res.status(400).json({ message: error })
    }
})
module.exports = router;
