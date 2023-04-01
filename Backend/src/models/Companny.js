const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^((?:[\w-]\.?)+)@((?:[\w-]+\.)+)([A-Za-z])/g, "Please fill a valid email adress"]
    },
    password: {
        type: String,
        minLenght: 4,
        required: true
    },
    phoneNumber: {
        type: String,
        minLenght: 10,
        required: true,
    },
    employers: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'employers'
    }],
    cashBox: {
        type: mongoose.Schema.Types.ObjectId, ref: 'cashBox'
    },
});

const Company = mongoose.model('Companny', companySchema);

module.exports = Company;