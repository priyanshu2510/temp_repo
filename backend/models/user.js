const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true,
    },
    emailOTP: {
        type: Number
    },
    mobileOTP: {
        type: Number
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    user_battery_id: {
        type: Number,
        default: 10000
    },
    user_driver_id: {
        type: Number,
        default: 20000
    },
    last_login_time: {
        type: String,
        default: null
    },
    last_login_date: {
        type: String,
        default: null
    }


});

const userModel = mongoose.model('users', userSchema);
module.exports = userModel;