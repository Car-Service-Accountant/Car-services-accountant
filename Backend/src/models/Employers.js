const mongoose = require('mongoose');

const employersSchema = new mongoose.Schema({
    username: {
        type: String,
        minLenght: 2,
        required: [true, "username is required!"]
    },
    email: {
        type: String,
        minLenght: 10,
        required: [true, "email is required!"],
        unique: true,
        match: [/^((?:[\w-]\.?)+)@((?:[\w-]+\.)+)([A-Za-z])/g, "Please fill a valid email adress"]
    },
    password: {
        type: String,
        minLenght: 4,
        required: true,
    },
    phoneNumber: {
        type: String,
        minLenght: 10,
        required: true,
    },
    role: {
        type: String,
    },
    companyID: {
        type: mongoose.Schema.Types.ObjectId, ref: 'company'
    }
});

const Employers = mongoose.model('employers', employersSchema);

module.exports = Employers;