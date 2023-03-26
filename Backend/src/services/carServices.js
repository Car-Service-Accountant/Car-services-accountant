const Car = require("../models/Car")

exports.addCar = async (Owner, CarNumber, phoneNumber, carModel, carMark) => {

    const exist = await Car.findOne({ CarNumber })

    if (exist) {
        throw new Error("Car is allready registred")
    }
    await Car.create({ Owner, CarNumber, phoneNumber, carModel, carMark })
}

exports.getCarByID = async (id) => {
    let car = await Car.find({ CarNumber: id }).populate("repairs");

    if (car.length === 0) {
        car = await Car.findById(id).populate("repairs");
    }
    return car;
}

exports.getCarByInfo = async (type, model) => {
    const data = await Car.find({ [type]: model })
    console.log(data);
    if (data.length == 0) {
        throw new Error("Cars with this model was not found!")
    }
    return data;
}

exports.getAllCars = async () => {
    const data = await Car.find();

    if (!data) {
        throw new Error("No car found here");
    }
    return data;
}

exports.getCarByNumber = async () => {

    const data = await Car.find();

    if (!data) {
        throw new Error("No car found here");
    }
    return data;
}

exports.updateCar = async (carID, data) => await Car.findByIdAndUpdate(carID, data)

exports.deleteCar = async (id) => Car.findByIdAndDelete(id)