const CashBox = require("../models/Cashbox");

exports.getCashbox = async (id) => await CashBox.findById(id);

exports.updateCashBox = async (id, data) => await CashBox.findByIdAndUpdate(id, { ...data });