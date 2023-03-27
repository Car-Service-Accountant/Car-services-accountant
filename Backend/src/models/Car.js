const mongoose = require('mongoose');

// TODO: we need to think about types and errors we want to recive here
const carSchema = new mongoose.Schema({
    owner: {
        type: String,
        required: true,
    },
    carNumber: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        minLenght: 10,
    },
    carModel: {
        type: String,
        required: true,
    },
    carMark: {
        type: String,
        required: true,
    },
    buildDate: {
        type: Date,
        require: true,
    },
    repairs: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Repair'
    }]
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;