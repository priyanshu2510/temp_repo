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

router.get('/locations', verifyToken, async (req, res) => {


    //Check If user Exists
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
        // Check If user is Admin or not
        if (user.isAdmin === true) {
            const c = await cbat.find().select({
                battery_id: 1,
                location: 1,
            });
            res.status(200).send(c);
        } else {
            const c1 = await cbat.find({
                permission: id
            }).select({
                battery_id: 1,
                location: 1,
            });
            res.status(200).send(c1);
        }
    });
});

router.get('/location-detail', verifyToken, async (req, res) => {


    //Check If user Exists
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
        // Check If user is Admin or not
        if (user.isAdmin === true) {
            const c = await cbat.find({
                battery_id: req.body.battery_id
            }).select({
                battery_id: 1,
                battery_company: 1,
                battery_reg_date: 1,
                dod: 1,
                battery_capacity: 1
            });
            res.status(200).send(c);
        } else {
            const c1 = await cbat.find({
                permission: id,
                battery_id: req.body.battery_id

            }).select({
                battery_id: 1,
                battery_company: 1,
                battery_reg_date: 1,
                dod: 1,
                battery_capacity: 1
            });
            res.status(200).send(c1);
        }
    });
});




























module.exports = router;