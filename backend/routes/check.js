var compression = require('compression')
const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');
const mongoose = require('mongoose');
const batteryIdCounter = require("../models/battery_id");
const cbat = require('../models/batteryfront');
const ciot = require("../models/batteryback");
const verifyToken = require("../utils/verifyToken");
const cuser = require("../models/user");
const ciotarray = require('../models/iotarray');
const cbatterytable = require('../models/battery_table');
const {
    response
} = require('express');

router.use(compression())

router.get('/device-check', async (req, res) => {

    cbat.findOne({
        battery_id: req.query.battery_id
    }, async (err, battery) => {
        if (err) {
            return res.json({
                status: 500,
                message: "Internal server error"
            });
        } else if (!battery) {
            return res.json({
                status: 404,
                message: "Battery Not Found....."
            });
        } else {
            if (battery.device_alloted) {
                return res.json({
                    status: 225,
                    message: `Device Already Alotted with Id ${battery.device_id}`
                });
            } else {
                return res.json({
                    status: 200,
                    message: "No Device Alloted...."
                });
            }

        }
    })

})






module.exports = router;