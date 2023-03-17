const mongoose = require('mongoose');

const repairSchema = new mongoose.Schema({
    service: [
        {
            type: String,
            minlength: [2, "Service is required!"],
            maxlength: [50, "Is too long for service, be more figuratively"],
        },
    ],
    parts: [
        {
            partName: {
                type: String,
                minlength: [2, "Part must be at least 2 char"],
            },
            servicePrice: { type: Number, required: true },
            clientPrice: { type: Number, required: true },
        },
    ],
    priceForLabor: { type: Number, default: 0 },
    note: { type: String, required: false, maxlength: 200 },
    endDate: { type: Date, default: Date.now }, // can be repaired, but we need to send it from FE
    createDate: { type: Date, default: Date.now },
    finished: { type: Boolean, default: false },
    paied: { type: Boolean, default: false },
});

const Repair = mongoose.model('Repair', repairSchema);

module.exports = Repair;