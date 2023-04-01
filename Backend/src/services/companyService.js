const Company = require("../models/Companny");

exports.getCompany = async (id) => await Company.findById(id);