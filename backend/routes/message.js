var compression = require('compression')
const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
    check,
    validationResult
} = require("express-validator");
const path = require('path');
const fs = require('fs');
const moment = require('moment-timezone');
const mongoose = require('mongoose');
const batteryIdCounter = require("../models/battery_id");
const cbat = require('../models/batteryfront');
const ciot = require("../models/batteryback");
const cuser = require("../models/user");
const sendmail = require('../utils/sendmail');
const sendPM = require('../utils/sendPM');
const verifyToken = require("../utils/verifyToken");

router.use(compression())


router.post('/email', (req, res) => {
    sendmail('Product Query','New Message', `
    
    <h3>
    <br>
    ${req.body.message}<br><br>
    </h3>
    <br>
    <h4>
    Contact
    <br>
    Email: ${req.body.email}
    <br>
    Phone: ${req.body.mobile}</h4>
`,
        'hello@mobilytics.global'
    );

    res.json({
        status: 200,
        message: "Message sent..."
    });
});


module.exports = router;