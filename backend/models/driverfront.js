const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const driverhistroy = new Schema({
    battery_id: {
        type: String,
        default: null,
    },
    wall_id: {
        type: String,
        default: null,
    },
    distance_travelled: {
        type: Number,
        default: 0.0
    },
    payment: {
        type: Number,
        default: 0.0
    },
    last_activity_time: {
        date: {
            type: String,
            default: null,
        },
        time: {
            type: String,
            default: null,
        }
    }
});
const driverSchema = new Schema({
    driver_id: {
        type: String,
        unique: true,
        required: true,
    },
    driver_name: {
        type: String,
        default: null
    },
    license_number: {
        type: String,
        default: null
    },
    driver_address: {
        type: String,
        default: null
    },
    mobile_number: {
        type: Number,
        unique: true,
        default: 9999999999,

    },
    driver_vechile_number: {
        type: String,
        default: null
    },
    total_distance: {
        type: Number,
        default: 0
    },
    total_payement: {
        type: Number,
        default: 0
    },
    total_swaps: {
        type: Number,
        default: 0
    },
    details: {
        type: [driverhistroy],
        default: []
    },
    other_info: {
        type: String,
        default: null
    },
    date: {
        type: String,
        default: null,
    },
    time: {
        type: String,
        default: null
    },
    driver_reg_date: {
        type: String,
        default: null
    },
    driver_reg_time: {
        type: String,
        default: null
    },
    status: {
        type: Boolean,
        default: true,
    },
    battery_alloted: {
        type: Boolean,
        default: false,
    },
    current_battery_id: {
        type: String,
        default: null,
    },
    permission: {
        type: String,
        default: null
    },
    user_driver_id: {
        type: Number,
        default: 0
    }

});

const DriverFrontCounter = mongoose.model('driverfront', driverSchema);
module.exports = DriverFrontCounter;