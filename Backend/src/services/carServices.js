const { model } = require("mongoose")
const Car = require("../models/Car")


exports.addCar = async (Owner, CarNumber, phoneNumber, carModel, carMark) => {

    const exist = await Car.findOne({ CarNumber })

    if (exist) {
        throw new Error("Car is allready registred")
    }
    await Car.create({ Owner, CarNumber, phoneNumber, carModel, carMark })
}

exports.getCarByID = async (id) => {
    const car = await Car.findById(id);

    if (!car) {
        throw new Error("Car was not found")
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