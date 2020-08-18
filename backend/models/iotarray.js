const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const iootSchema = new Schema({
    device_id: {
        type: String,
        required: true
    },
    lattitude: {
        type: Number,
        default: 0.0,
    },
    longitude: {
        type: Number,
        default: 0.0,
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
const iotSchema = new Schema({
    device_id: {
        type: String,
        unique: true,
        required: true
    },
    battery_id: {
        type: String,
       // unique: true,
        //default: null
        //required: true
    },
    count: {
        type: Number,
        default: 0
    },
    details: {
        type: [iootSchema],
        default: []
    },
});

const IotArray = mongoose.model('iotarray', iotSchema);
module.exports = IotArray;