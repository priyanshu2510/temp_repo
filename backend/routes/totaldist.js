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
const ctotaldistance=require('../models/totaldistance');
const app = express();
const server = http.createServer(app);
const api_call = require('../utils/callmapapi');


router.use(compression())

router.get('/totaldist', async (req, res) => {



    const c = await ctotaldistance.find({
        name: 'total'
    }).select({
        details: 1,
    });

    if (c.length === 0) {
        return res.json({
            status: 400,
            message: "Data not found"
        });
    }

    res.status(200).send(c);
});
module.exports = router;