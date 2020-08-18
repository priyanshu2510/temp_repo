var compression = require('compression')
const express = require('express');
const router = express.Router();
const http = require('http');
const moment = require('moment-timezone');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const ciot = require("../models/batteryback");
const cbat = require('../models/batteryfront');
const ciotarray = require('../models/iotarray');
const app = express();
const server = http.createServer(app);
const api_call = require('../utils/callmapapi');
const batteryIdCounter = require("../models/battery_id");
const driverIdCounter = require("../models/driver_id");

router.use(compression())

//Get Total Battery
router.get('/totalbattery', async (req, res) => {



    let battery = 0;
    await batteryIdCounter.findOne({
        find: "Battery"
    }, async (err, response) => {
        if (response) {
            battery = response.count - 30000;
            return res.json({
                status: 200,
                total: battery,
                message: "Given"
            });
        }
        if (err) {
            return res.json({
                status: 500,
                total: 0,
                message: "Internal server error"
            });
        }
    });
})



//Get Total Driver
router.get('/totaldriver', async (req, res) => {



    let driver = 0;
    await driverIdCounter.findOne({
        find: "USER"
    }, async (err, response) => {
        if (response) {
            driver = response.count - 40000;
            return res.json({
                status: 200,
                total: driver,
                message: "Given"
            });
        }
        if (err) {
            return res.json({
                status: 500,
                total: 0,
                message: "Internal server error"
            });
        }
    });
})


module.exports = router;