var compression = require('compression')
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const moment =require('moment-timezone');
const mongoose = require('mongoose');
const driverIdCounter = require("../models/driver_id");
const cdriv = require('../models/driverfront');
const verifyToken = require("../utils/verifyToken");
const cuser = require("../models/user");

router.use(compression())

router.get('/driver-stats', verifyToken, async (req, res) => {
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
        // User already verified
        if (user.isAdmin === true) {
            const c = await cdriv.find();
            res.status(200).send(c);
        } else {
            const c1 = await cdriv.find({
                permission: id
            });
            res.status(200).send(c1);
        }
    });
});




router.get('/driver-stats/:id', verifyToken, async (req, res) => {

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
        // User already verified
        if (user.isAdmin === true) {
            cdriv.findOne({
                driver_id: req.params.id
            }, async (err, response) => {
                if (response) {
                    res.status(200).send(response);
                }
                if (err) {
                    return res.json({
                        status: 404,
                        message: "Driver Not found"
                    });
                }

            })
        } else {
            cdriv.findOne({
                driver_id: req.params.id,
                permission: id
            }, async (err, response) => {
                if (response) {
                    res.status(200).send(response);
                }
                if (err) {
                    return res.json({
                        status: 404,
                        message: "Driver Not found"
                    });
                }

            })
        }
    });
});

router.post('/driver-add', verifyToken, async (req, res) => {
    const id = req.userId;
    if (!id) {
        return res.json({
            status: 422,
            message: "Missing User ID"
        });
    }
    let driverId = -1;
    var userdriverid = -1;
    await cuser.findOne({
        _id: id
    }, async (err, result) => {
        if (result) {
            userdriverid = result.user_driver_id + 1;
            result.user_driver_id = userdriverid;
            await result.save(err => {
                if (err) {
                    return res.json({
                        status: 500,
                        message: "Internal server error"
                    });
                }
            });
        }
    });
    await driverIdCounter.findOne({
        find: "USER"
    }, async (err, response) => {
        if (response) {
            driverId = response.count + 1;
            response.count = driverId;
            await response.save(err => {
                if (err) {
                    return res.json({
                        status: 500,
                        message: "Internal server error"
                    });
                }
            });


            const c = new cdriv({
                driver_id: driverId,
                driver_name: req.body.driver_name,
                license_number: req.body.license_number,
                driver_address: req.body.driver_address,
                mobile_number: req.body.mobile_number,
                driver_vechile_number: req.body.driver_vechile_number,
                other_info: req.body.other_info,
                driver_reg_date: moment().tz("Asia/Kolkata").format('L'),
                driver_reg_time: moment().tz("Asia/Kolkata").format('HH:mm:ss'),
                permission: id,
                user_driver_id: userdriverid

            });
            const p = "[ DRIVER-" + driverId + " ]";
            await c.save(err => {
                if (err) {
                    return res.json({
                        status: 500,
                        message: "Internal server error"

                    });
                }
                return res.json({
                    status: 200,
                    message: "Driver added successfully",
                    data: p,

                });
            });

        }
    });
});


module.exports = router;