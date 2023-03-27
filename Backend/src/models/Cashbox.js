const mongoose = require('mongoose');

const cashBoxSchema = new mongoose.Schema({
    totalAmount: {
        type: Number,
        default: 0,
    },
    totalForMonth: {
        type: Number,
        default: 0,
    },
    additionalCosts: {
        type: Number,
        default: 0,
    },
    employersSellary: {
        type: Number,
        default: 0,
    },
    profit: {
        type: Number,
        default: 0,
    },
    cost: {
        type: Number,
        default: 0,
    }
});

const CashBox = mongoose.model('cashBox', cashBoxSchema);

module.exports = CashBox;