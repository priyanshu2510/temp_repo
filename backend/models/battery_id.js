const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const batteryIdCounterSchema = new Schema({
    find: {
        type: String,
        default: 'Battery'
    },
    count: {
        type: Number,
        default: 0
    }
});

const BatteryIdCounter = mongoose.model('batteryidcounters', batteryIdCounterSchema);
module.exports = BatteryIdCounter;