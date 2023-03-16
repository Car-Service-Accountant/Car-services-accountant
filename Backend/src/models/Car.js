const mongoose = require('mongoose');

// TODO: we need to think about types and errors we want to recive here
const carSchema = new mongoose.Schema({
    Owner: {
        type: String,
        require: true,
    },
    CarNumber: {
        type: String,
        require: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        require: true,
        minLenght: 10,
    },
    carModel: {
        type: String,
        require: true,
    },
    carMark: {
        type: String,
        require: true,
    },
    repairs: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Repair'
    }]
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;