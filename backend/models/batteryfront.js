const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const batteryhistroy = new Schema({
    last_position: {
        type: String,
        default: null
    },
    energy_percent: {
        type: Number,
        default: 0
    },
    cdtime: {
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
const batterysSchema = new Schema({
    battery_id: {
        type: String,
        unique: true,
        required: true,
    },
    device_id: {
        type: String,
        default: null
    },
    device_alloted: {
        type: Boolean,
        default: false
    },
    prev_device_id: {
        type: [String],
        default: []
    },
    battery_company: {
        type: String,
        default: null
    },
    location: {
        lattitude: {
            type: Number,
            default: 0
        },
        longitude: {
            type: Number,
            default: 0
        }

    },
    temp: {
        type: Number,
        default: 0
    },
    current: {
        type: Number,
        default: 0
    },
    voltage: {
        type: Number,
        default: 0
    },
    soh: {
        type: Number,
        default: 0
    },
    soc: {
        type: Number,
        default: 0
    },
    stat_level: {
        type: String,
        default: null
    },
    current_location: {
        type: String,
        default: "Wall-1024"
    },
    details: {
        type: [batteryhistroy],
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
    swaps: {
        type: Number,
        default: 0
    },
    maxswaps: {
        type: Number,
        default: 0
    },
    battery_reg_date: {
        type: String,
        default: null
    },
    battery_reg_time: {
        type: String,
        default: null
    },
    energy_percent: {
        type: Number,
        default: 0
    },
    true_range: {
        type: Number,
        default: 0
    },
    total_distance: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: true,
    },
    cycle_count: {
        type: Number,
        default: 0
    },
    battery_capacity: {
        type: Number,
        default: 0
    },
    dod: {
        type: Number,
        default: 0
    },
    battery_in_use: {
        type: Boolean,
        default: false
    },
    permission: {
        type: String,
        default: null
    },
    user_battery_id: {
        type: Number,
        default: 0
    }

});

const BatteryFrontCounter = mongoose.model('batteryfront', batterysSchema);
module.exports = BatteryFrontCounter;