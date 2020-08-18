const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const totalSchema = new Schema({
    name: {
        type: String,
        default: "total"
    },
    distance: {
        type: Number,
        default: 0
    },
    details: {
        total_distance: {
            type: Number,
            default: 0
        },
        time: {
            type: String,
            default: null
        },
        date: {
            type: String,
            default: null
        }
    }
});

const totalModel = mongoose.model('totaldistance', totalSchema);
module.exports = totalModel;