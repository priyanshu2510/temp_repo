const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const moment = require('moment-timezone');
const mongoose = require('mongoose');
const shortid = require('shortid');
const batteryIdCounter = require("../models/battery_id");
const cbat = require('../models/batteryfront');
const ciot = require("../models/batteryback");
const sendEmail = require('../utils/sendemail');
const sendPM = require('../utils/sendPM');
const verifyToken = require("../utils/verifyToken");
const cuser = require("../models/user");

router.get('/keygen', verifyToken, async (req, res) => {


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
        if (user.api_key == null) {
            let key = shortid.generate('14');
            key = key + "*";
            user.api_key = key;
            user.save(err => {
                if (err) {
                    return res.json({
                        status: 500,
                        message: "Internal server error"
                    });
                }
            });
            console.log(key);
            return res.json({
                status: 200,
                apikey: key
            });
        } else {
            return res.json({
                status: 200,
                apikey: user.api_key
            });
        }
    });


});





module.exports = router;