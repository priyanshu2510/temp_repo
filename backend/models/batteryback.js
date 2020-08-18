const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const batterySchema = new Schema({
    device_id: {
        type: String,
        unique: true,
        required: true
    },
    mac_id: {
        type: String,
        required: true,
        default: null
    },
    user_email: {
        type: String,
        default: null
    },
    battery_id: {
        type: String,
        //unique: true,
        //required: true
        // default: null
    },
    battery_alloted: {
        type: Boolean,
        default: false
    },
    lattitude: {
        type: Number,
        default: 28393581,
    },
    longitude: {
        type: Number,
        default: 77180434,
    },
    current: {
        type: Number,
        default: 0
    },
    voltage: {
        type: Number,
        default: 0
    },
    soc: {
        type: Number,
        default: 0
    },
    theo_soc: {
        type: Number,
        default: 0
    },
    soh: {
        type: Number,
        default: 0
    },
    iot_soh: {
        type: Number,
        default: 0
    },
    CapAh: {
        type: Number,
        default: 0
    },
    temp1: {
        type: Number,
        default: 0
    },
    temp2: {
        type: Number,
        default: 0
    },
    temp3: {
        type: Number,
        default: 0
    },
    temp4: {
        type: Number,
        default: 0
    },
    c1: {
        type: Number,
        default: 0
    },
    c2: {
        type: Number,
        default: 0
    },
    c3: {
        type: Number,
        default: 0
    },
    c4: {
        type: Number,
        default: 0
    },
    c5: {
        type: Number,
        default: 0
    },
    c6: {
        type: Number,
        default: 0
    },
    c7: {
        type: Number,
        default: 0
    },
    c8: {
        type: Number,
        default: 0
    },
    c9: {
        type: Number,
        default: 0
    },
    c10: {
        type: Number,
        default: 0
    },
    c11: {
        type: Number,
        default: 0
    },
    c12: {
        type: Number,
        default: 0
    },
    c13: {
        type: Number,
        default: 0
    },
    c14: {
        type: Number,
        default: 0
    },
    c15: {
        type: Number,
        default: 0
    },
    c16: {
        type: Number,
        default: 0
    },
    c17: {
        type: Number,
        default: 0
    },
    c18: {
        type: Number,
        default: 0
    },
    c19: {
        type: Number,
        default: 0
    },
    c20: {
        type: Number,
        default: 0
    },
    cycleCount: {
        type: Number,
        default: 0
    },
    gpsSpeed: {
        type: Number,
        default: 0
    },
    satelliteCount: {
        type: Number,
        default: 0
    },
    date: {
        type: String,
        default: null
    },
    time: {
        type: String,
        default: null
    }
});

const BatteryBackCounter = mongoose.model('batteryback', batterySchema);
module.exports = BatteryBackCounter;