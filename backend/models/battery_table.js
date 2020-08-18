const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const batterytableSchema = new Schema({
    battery_id: {
        type: String,
        default: null,
    },
    device_id: {
        type: String,
        default: null
    },
    previous_soc: {
        type: Number,
        default: 0
    },
    charging_time: {
        type: Number,
        default: 0
    },
    discharging_time: {
        type: Number,
        default: 0
    },
    date: {
        type: String,
        default: null,
    },
    time: {
        type: String,
        default: null
    },
});

const BatteryTable = mongoose.model('batterytable', batterytableSchema);
module.exports = BatteryTable;