const Car = require("../models/Car")

exports.addCar = async (buildDate, owner, carNumber, phoneNumber, carModel, carMark) => {
    const exist = await Car.findOne({ carNumber })
    if (exist) {
        throw new Error("Car is allready registred")
    }
    const car = Car.create({ buildDate, owner, carNumber, phoneNumber, carModel, carMark })
    return car
}

exports.getCarByID = async (id) => {
    let car = await Car.find({ carNumber: id }).populate("repairs");

    if (car.length === 0) {
        car = await Car.findById(id).populate("repairs");
    }
    return car;
}

exports.getCarByInfo = async (type, model) => {
    const data = await Car.find({ [type]: model })
    if (data.length == 0) {
        throw new Error("Cars with this model was not found!")
    }
    return data;
}

exports.getAllCars = async () => {
    const data = await Car.find().populate('repairs');

    if (!data) {
        throw new Error("No car found here");
    }
    return data;
}

exports.updateCar = async (carID, data) => await Car.findByIdAndUpdate(carID, data)

exports.deleteCar = async (id) => Car.findByIdAndDelete(id)