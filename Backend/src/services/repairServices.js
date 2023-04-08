const Repair = require("../models/Repair");
const Car = require("../models/Car");
const { getCarByID, updateCar } = require("../services/carServices");

exports.createRepair = async (carID, data) => {

    const repair = await Repair.create(data)
    const car = await getCarByID(carID);
    if (!car) {
        throw new Error("Car not found")
    }
    car.repairs.push(repair._id);
    return await updateCar(carID, car);
}

exports.getAllRepairs = async () => await Repair.find()

exports.getRepairById = async (id) => await Repair.findById(id);

exports.updateRepair = async (repairID, data) => await Repair.findByIdAndUpdate(repairID, { ...data })

exports.deleteRepair = async (id) => {


    await Repair.findByIdAndDelete(id)
};