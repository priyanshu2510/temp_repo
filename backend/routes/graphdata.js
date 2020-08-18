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


router.use(compression())

//Get the Graph Data For Battery
router.get('/graph-stats-soh', async (req, res) => {


    // console.log(moment().subtract(1,'day').tz("Asia/Kolkata").format('L'));
    const c = await ciotarray.find({
        battery_id: req.query.battery_id
    }).select({
        'details.soh': 1,
        'details.date':1,
        'details.time':1

    });

    if (c.length === 0) {
        return res.json({
            status: 400,
            message: "Data not found"
        });
    }

    res.status(200).send(c);
})
router.get('/graph-stats-soc', async (req, res) => {


    // console.log(moment().subtract(1,'day').tz("Asia/Kolkata").format('L'));
    const c = await ciotarray.find({
        battery_id: req.query.battery_id
    }).select({
        'details.soc': 1,
        'details.theo_soc': 1,
        'details.date':1,
        'details.time':1
    });

    if (c.length === 0) {
        return res.json({
            status: 400,
            message: "Data not found"
        });
    }

    res.status(200).send(c);
})
router.get('/graph-stats-temp', async (req, res) => {


    // console.log(moment().subtract(1,'day').tz("Asia/Kolkata").format('L'));
    const c = await ciotarray.find({
        battery_id: req.query.battery_id
    }).select({
        'details.temp1': 1,
        'details.temp2': 1,
        'details.date':1,
        'details.time':1
    });

    if (c.length === 0) {
        return res.json({
            status: 400,
            message: "Data not found"
        });
    }

    res.status(200).send(c);
})
router.get('/graph-stats-current', async (req, res) => {


    // console.log(moment().subtract(1,'day').tz("Asia/Kolkata").format('L'));
    const c = await ciotarray.find({
        battery_id: req.query.battery_id
    }).select({
        'details.current': 1,
        'details.date':1,
        'details.time':1
    });

    if (c.length === 0) {
        return res.json({
            status: 400,
            message: "Data not found"
        });
    }

    res.status(200).send(c);
})
router.get('/graph-stats', async (req, res) => {


    // console.log(moment().subtract(1,'day').tz("Asia/Kolkata").format('L'));
    const c = await ciotarray.find({
        battery_id: req.query.battery_id
    });

    if (c.length === 0) {
        return res.json({
            status: 400,
            message: "Data not found"
        });
    }

    res.status(200).send(c);
})

module.exports = router;