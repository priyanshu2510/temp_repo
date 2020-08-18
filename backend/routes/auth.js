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



router.post('/register', (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (errors.errors[0].param === "email") {
                return res.json({
                    status: 422,
                    message: "Invalid email address"
                });
            } else if (errors.errors[0].param === "phoneNo") {
                return res.json({
                    status: 422,
                    message: "Invalid Phone No"
                });
            } else {
                return res.json({
                    status: 422,
                    message: "Invalid password, password length must be greater than 5."
                });
            }
        }
        next();
    },
    (req, res, next) => {


        cuser.findOne({
            email: req.body.email
        }, (err, user) => {
            if (err) {
                return res.json({
                    status: 500,
                    message: "Error on the server"
                });
            } else if (user) {
                return res.json({
                    status: 415,
                    message: "User already exits"
                });
            }
            next();
        });
    },
    (req, res) => {
        //continue registration
        let name = req.body.name.toString().trim();
        let email = req.body.email.toString().trim();
        let phoneNo = req.body.phoneNo.toString().trim();
        if (email && req.body.password && req.body.phoneNo) {

            bcrypt.hash(req.body.password, 8, (err, hashedPassword) => {
                if (err) {
                    return res.json({
                        status: 500,
                        message: "Internal server error"
                    });
                }

                const emailOTP = Math.floor(100000 + Math.random() * 900000).toString();
                const mobileOTP = Math.floor(100000 + Math.random() * 900000).toString();
                cuser.create({
                        name: name,
                        email: email,
                        password: hashedPassword,
                        phoneNo: phoneNo,
                        emailOTP: emailOTP,
                        mobileOTP: mobileOTP
                    },
                    (err, user) => {
                        if (err) {
                            return res.json({
                                status: 500,
                                message: "Something went wrong while registering the user, please try again"
                            });
                        }

                        let token = jwt.sign({
                            id: user._id
                        }, "*", {
                            expiresIn: 86400
                        });
                        res.json({
                            status: 200,
                            isVerified: false,
                            token: token
                        });

                        sendmail('Mobilytics Team', 'Email Verification', `
                            <h2 align="center">Mobilytics</h2>
                            <p>
                            Hi,<br><br>
                            Your registration email OTP is: ${emailOTP}.<br><br>
                            Regards,<br>
                            Web Team<br>
                            Mobilytics</p>
                        `,
                            email
                        );

                        sendPM(`${mobileOTP}`, phoneNo);
                        sendmail('SignUp', 'New Signup', `
    
    <h3>A New User has Signed Up</h3>
    <br>
    <h4>
    Name : ${name}
    <br>
    Email : ${email}
    <br>
    Phone : ${phoneNo}
    </h4>
    <br><br>
    Regards,<br>
    Web Team<br>
    Mobilytics</p>
   
`,
                            'hello@mobilytics.global'
                        );
                    }
                );
            });
        } else {
            res.json({
                status: 400,
                message: "Missing required value"
            });
        }
    }


);






router.post("/verify", verifyToken, (req, res) => {
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
        if (user.isVerified === true) {
            return res.json({
                status: 400,
                message: "User Already Verified"
            });
        }
        // Data Validation
        let {
            emailOTP,
            mobileOTP,
            // phoneNo,
        } = req.body;

        if (
            !emailOTP ||
            !mobileOTP
        ) {
            return res.json({
                status: 422,
                message: "Missing Data Fields"
            });
        }

        emailOTP = emailOTP.toString().trim();
        mobileOTP = mobileOTP.toString().trim();
        // name = name.toString().trim();



        if (!emailOTP || !mobileOTP) {
            return res.json({
                status: 422,
                message: "Invalid OTP"
            });
        }
        // if (name === "") {
        //     return res.json({
        //         status: 422,
        //         message: "Empty Name"
        //     });
        // }


        try {
            emailOTP = Number(emailOTP);
            if (!emailOTP) {
                throw "Invalid OTP";
            }
        } catch (e) {
            return res.json({
                status: 422,
                message: e
            });
        }
        try {
            mobileOTP = Number(mobileOTP);
            if (!mobileOTP) {
                throw "Invalid OTP";
            }
        } catch (e) {
            return res.json({
                status: 422,
                message: e
            });
        }
        // Validate OTPs
        if (user.emailOTP !== emailOTP) {
            return res.json({
                status: 401,
                message: "Invalid OTP"
            });
        }
        if (user.mobileOTP !== mobileOTP) {
            return res.json({
                status: 401,
                message: "Invalid OTP"
            });
        }
        // user.name = name;
        user.isVerified = true;
        user.emailOTP = -1;
        user.mobileOTP = -1;



        await user.save(err => {
            if (err) {
                return res.json({
                    status: 500,
                    message: "Internal server error"
                });
            }
            return res.json({
                status: 200,
                isVerified: true,
                token: req.headers["x-access-token"],
            });
        });

    });

});










router.post(
    "/login",
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (errors.errors[0].param == "email") {
                return res.json({
                    status: 422,
                    message: "Invalid email address"
                });
            } else {
                return res.json({
                    status: 422,
                    message: "Invalid password."
                });
            }
        }
        next();
    },
    (req, res) => {
        let email = req.body.email.toString().trim();
        if (email && req.body.password) {
            cuser.findOne({
                email: email
            }, (err, user) => {
                if (err) {
                    return res.json({
                        status: 500,
                        message: "Internal server error"
                    });
                } else if (!user) {
                    return res.json({
                        status: 404,
                        message: "No such user exists"
                    });
                } else {
                    bcrypt.compare(req.body.password, user.password, function (err, result) {
                        if (err) {
                            return res.json({
                                status: 500,
                                message: "Internal server error"
                            });
                        }
                        if (result) {
                            let token = jwt.sign({
                                id: user._id
                            }, "*", {
                                expiresIn: 86400
                            });
                            sendmail('Login', 'New Login', `
    
    <h3>A  User has Logged In</h3>
    <br>
    <h4>
    Name : ${user.name}
    <br>
    Email : ${email}
    </h4>
    <br><br>
    Regards,<br>
    Web Team<br>
    Mobilytics</p>
   
`,
                                'hello@mobilytics.global'
                            );
                            // isVerified
                            if (user.isVerified) {
                                return res.json({
                                    status: 200,
                                    isVerified: true,
                                    token: token,
                                    isAdmin: user.isAdmin
                                });
                            }
                            const emailOTP = Math.floor(100000 + Math.random() * 900000).toString();
                            const mobileOTP = Math.floor(100000 + Math.random() * 900000).toString();
                            user.emailOTP = emailOTP;
                            user.mobileOTP = mobileOTP;
                            user.save(err => {
                                if (err) {
                                    return res.json({
                                        status: 500,
                                        message: "Internal server error"
                                    });
                                }
                                res.json({
                                    status: 200,
                                    isVerified: false,
                                    token: token
                                });
                                sendmail('Mobilytics Team', 'Email Verification', `
                                <h2 align="center">Mobilytics</h2>
                                <p>
                                Hi,<br><br>
                                Your registration email OTP is: ${emailOTP}.<br><br>
                                Regards,<br>
                                Web Team<br>
                                Mobilytics</p>
                            `,
                                    email
                                );

                                sendPM(`${mobileOTP}`, user.phoneNo);




                            })
                        } else {
                            return res.json({
                                status: 401,
                                message: "Incorrect Email or Password"
                            });
                        }
                    });
                }
            });
        } else {
            return res.json({
                status: 404,
                message: "Missing required details"
            });
        }
    }
);




router.post("/forgotPassword",
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({
                status: 422,
                message: "Invalid email address"
            });
        }
        next();
    },
    (req, res) => {
        let email = req.body.email.toString().trim();
        if (email) {
            cuser.findOne({
                email: email
            }, async (err, user) => {
                if (err) {
                    return res.json({
                        status: 500,
                        message: "Internal Server Error"
                    });
                }
                if (!user) {
                    return res.json({
                        status: 500,
                        message: "Email id does not exist"
                    });
                }
                const emailOTP = Math.floor(100000 + Math.random() * 900000).toString();
                user.emailOTP = emailOTP;
                try {
                    await user.save();
                    res.json({
                        status: 200,
                        message: "OTP sent to your email address"
                    });

                    //email
                    sendmail('Mobilytics Team', 'Forgot Password', `
                                <h2 align="center">Mobilytics</h2>
                                <p>
                                Hi,<br><br>
                                Your email OTP is: ${emailOTP}.<br><br>
                                Regards,<br>
                                Web Team<br>
                                Mobilytics</p>
                            `,
                        email
                    );
                } catch (e) {
                    res.json({
                        status: 500,
                        message: "Internal Server Error"
                    });
                }
            });
        } else {
            return res.json({
                status: 404,
                message: "Missing required details"
            });
        }
    });


router.post(
    "/changePassword",
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (errors.errors[0].param == "email") {
                return res.json({
                    status: 422,
                    message: "Invalid email address"
                });
            } else {
                return res.json({
                    status: 422,
                    message: "Invalid password, password length must be greater than 5."
                });
            }
        }
        next();
    },
    (req, res, next) => {
        let emailOTP = req.body.emailOTP;
        if (!emailOTP) {
            return res.json({
                status: 422,
                message: "Missing email OTP"
            });
        }
        try {
            emailOTP = Number(emailOTP);
            if (!emailOTP) {
                throw "Invalid email OTP";
            }
        } catch (e) {
            return res.json({
                status: 422,
                message: e
            });
        }
        cuser.findOne({
            email: req.body.email
        }, (err, user) => {
            if (err) {
                return res.json({
                    status: 500,
                    message: "Internal Server Error"
                });
            }
            if (!user) {
                return res.json({
                    status: 500,
                    message: "No user found"
                });
            }
            if (user.emailOTP !== emailOTP) {
                return res.json({
                    status: 400,
                    message: "Wrong otp , please try again"
                });
            } else if (req.body.password !== req.body.confPassword) {
                return res.json({
                    status: 400,
                    message: "Password does not match"
                });
            } else {
                bcrypt.hash(req.body.password, 8, (err, hashedPassword) => {
                    if (err) {
                        return res.json({
                            status: 500,
                            message: "Internal server error"
                        });
                    }
                    user.password = hashedPassword;
                    user.emailOTP = -1;
                    user.save(err => {
                        if (err) {
                            return res.json({
                                status: 500,
                                message: "Internal Server Error"
                            });
                        } else {
                            return res.json({
                                status: 200,
                                message: " Password succesfully changed"
                            });
                        }
                    });
                });
            }
        });
    }
);




router.get("/getUserState", verifyToken, (req, res) => {
    const userMongoId = req.userId;
    async function getState() {
        try {
            const user = await cuser.findById(userMongoId);
            if (!user) {
                return res.json({
                    status: 400,
                    auth: false,
                    message: 'User not found!',
                    verified: false
                });
            }
            if (user.isVerified) {


                cuser.findOneAndUpdate({
                    _id: userMongoId
                }, {
                    $set: {
                        last_login_time: moment().tz("Asia/Kolkata").format('HH:mm:ss'),
                        last_login_date: moment().tz("Asia/Kolkata").format('L'),
                    }
                }, {
                    new: true
                }).then((result) => {
                    if (!result) {
                        res.status(400).send(result);
                    }
                }).catch((err) => {
                    res.status(400).send(err);
                })








                return res.json({
                    status: 200,
                    auth: true,
                    message: 'Token authenticated!',
                    verified: true,
                    isAdmin: user.isAdmin
                });
            } else {
                return res.json({
                    status: 400,
                    auth: true,
                    message: 'Token authenticated!',
                    verified: false,
                    email: user.email,
                    phoneNo: user.phoneNo
                });
            }
        } catch (err) {
            return res.json({
                status: 500,
                auth: false,
                message: 'Internal server error!',
                verified: false
            });
        }
    }
    getState();
});



router.post("/logout", (req, res) => {
    return res.json({
        status: 200,
        token: ""
    });
});

module.exports = router;