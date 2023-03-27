const CashBox = require("../models/Cashbox");

exports.addMonney = async (data) => await CashBox.create({ ...data });
