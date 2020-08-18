const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const driverIdCounterSchema = new Schema({
    find: {
        type: String,
        default: 'USER'
    },
    count: {
        type: Number,
        default: 0
    }
});

const DriverIdCounter = mongoose.model('driveridcounters', driverIdCounterSchema);
module.exports = DriverIdCounter;