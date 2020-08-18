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


router.get('/detail', verifyToken, async (req, res) => {



    const id = req.userId;
    if (!id) {
        return res.json({
            status: 422,
            message: "Missing User ID"
        });
    }
    cuser.findById(id, async (err, user) => {
        if (err) {
            return res.json({
                status: 500,
                message: "Server Error"
            });
        }
        if (!user) {
            return res.json({
                status: 401,
                message: "User Not found"
            });
        }

        return res.json({
            status: 200,
            name: user.name,
            isAdmin: user.isAdmin,
            email: user.email,
            phoneNo: user.phoneNo,
            last_login_date: user.last_login_date,
            last_login_time: user.last_login_time,


        });
    });
});


router.get('/userdevicedetail', verifyToken, async (req, res) => {
    const id = req.userId;
    if (!id) {
        return res.json({
            status: 422,
            message: "Missing User ID"
        });
    }
    cuser.findById(id, async (err, user) => {
        if (err) {
            return res.json({
                status: 500,
                message: "Server Error"
            });
        }
        if (!user) {
            return res.json({
                status: 401,
                message: "User Not found"
            });
        }
        if (user.isAdmin === true) {
            const c = await cuser.find().select({
                name: 1,
                email: 1
            });
            res.status(200).send(c);
        } else {
            res.status(404).end("Not Found");
        }


    })
});
module.exports = router;