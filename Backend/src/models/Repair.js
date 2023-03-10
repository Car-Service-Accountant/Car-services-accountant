const mongoose = require('mongoose');

const repairSchema = new mongoose.Schema({
//:TODO add repair schema for DB
});

const Repair = mongoose.model('Repair', repairSchema);

module.exports = Repair;