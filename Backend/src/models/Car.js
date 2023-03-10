const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    Owner: {
        type: String, 
        require: true,
    },
    CarID:{ 
        type: String,
        require: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        require: true,
        minLenght: 10,
    },
    carModel:{
        type: String,
        require: true,
    }
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;