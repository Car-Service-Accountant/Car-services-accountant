const Employers = require("../models/Employers")

exports.getAllEmployers = async () => {
    const data = await Employers.find({}, { password: 0, __v: 0 });

    if (!data) {
        throw new Error("No employer found here");
    }
    return data;
}

exports.getCurrentEmployer = async (id) => {
    const data = await Employers.findById(id);

    if (!data) {
        throw new Error("No employer found here");
    }
    return data;
}

exports.deleteEmployer = async (id) => Employers.findByIdAndDelete(id);