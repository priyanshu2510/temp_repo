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


//Route To get all battery Details
router.get('/battery-stats', verifyToken, async (req, res) => {


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
            const c = await cbat.find();
            res.status(200).send(c);
        } else {
            const c1 = await cbat.find({
                permission: id
            });
            res.status(200).send(c1);
        }
    });
});




//Route to get Details of Particular Battery
router.get('/battery-stats/:id', verifyToken, async (req, res) => {


    //Check if User Exists
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
            cbat.findOne({
                battery_id: req.params.id
            }, async (err, response) => {
                if (response) {
                    res.status(200).send(response);
                }
                if (err) {
                    return res.json({
                        status: 404,
                        message: "Battery Not found"
                    });
                }
            });
        } else {
            cbat.findOne({
                battery_id: req.params.id,
                permission: id
            }, async (err, response) => {
                if (response) {
                    res.status(200).send(response);
                }
                if (err) {
                    return res.json({
                        status: 404,
                        message: "Battery Not found"
                    });
                }
            });
        }
    });
});




//Route To add New Battery
router.post('/battery-add', verifyToken, async (req, res) => {


    //Check if user exists
    const id = req.userId;
    if (!id) {
        return res.json({
            status: 422,
            message: "Missing User ID"
        });
    }
    const User = await cuser.findById(id);
    if (!User) {
        return res.json({
            status: 404,
            message: "User not found"
        });
    }



    //Increment the battery id and user battery id
    var batteryId = -1;
    var userbatteryid = -1;
    await cuser.findOne({
        _id: id
    }, async (err, result) => {
        if (result) {
            userbatteryid = result.user_battery_id + 1;
            result.user_battery_id = userbatteryid;
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


    await batteryIdCounter.findOne({
        find: "Battery"
    }, async (err, response) => {
        if (response) {
            batteryId = response.count + 1;
            response.count = batteryId;
            await response.save(err => {
                if (err) {
                    return res.json({
                        status: 500,
                        message: "Internal server error"
                    });
                }
            });

            const c = new cbat({
                battery_id: batteryId,
                battery_company: req.body.battery_company,
                current_location: req.body.current_location,
                voltage: req.body.voltage,
                other_info: req.body.other_info,
                maxswaps: req.body.maxswaps,
                battery_reg_date: moment().tz("Asia/Kolkata").format('L'),
                battery_reg_time: moment().tz("Asia/Kolkata").format('HH:mm:ss'),
                battery_capacity: req.body.battery_capacity,
                dod: req.body.dod,
                permission: id,
                user_battery_id: userbatteryid
            });
            cbatterytable.create({
                battery_id: batteryId
            }, (err, user) => {
                if (err) {
                    console.log(err);
                    return res.json({
                        status: 500,
                        message: "Something went wrong while registering the Battery Table, please try again"
                    });
                }
            });
            const p = "[ BMX" + userbatteryid + " ]";
            await c.save(err => {
                if (err) {
                    return res.json({
                        status: 500,
                        message: "Internal server error"
                    });
                }
                return res.json({
                    status: 200,
                    message: "Battery added successfully",
                    data: p,

                });
            })
        }
    });
});




//Route to Add Battery To Device
router.post('/battery-device-add', async (req, res) => {


    //Check and Assign Battery to Device
    await ciot.findOneAndUpdate({
        device_id: req.body.device_id
    }, {
        $set: {
            battery_id: req.body.battery_id,
            battery_alloted: true
        }
    }, {
        new: true
    }).then((result) => {
        if (!result) {
            return res.json({
                status: 404,
                message: "Error in Assinging Battery or Device Not Found"
            });
        }
    }).catch((err) => {
        res.status(400).send(err);
    });


    //Check and assign battery to device array
    await ciotarray.findOneAndUpdate({
        device_id: req.body.device_id
    }, {
        $set: {
            battery_id: req.body.battery_id
        }
    }, {
        new: true
    }).then((result) => {
        if (!result) {
            return res.json({
                status: 404,
                message: "Something Went Wrong......"
            });
        }
    }).catch((err) => {
        res.status(400).send(err);
    });


    await cbatterytable.findOneAndUpdate({
        battery_id: req.body.battery_id
    }, {
        $set: {
            device_id: req.body.device_id
        }
    }, {
        new: true
    }).then((result) => {
        if (!result) {
            return res.json({
                status: 404,
                message: "Something Went Wrong......"
            });
        }
    }).catch((err) => {
        res.status(400).send(err);
    });


    //Check and Assign Device to Battery
    cbat.findOneAndUpdate({
        battery_id: req.body.battery_id
    }, {
        $set: {
            device_id: req.body.device_id,
            device_alloted: true
        }
    }, {
        new: true
    }).then((result) => {
        if (result) {
            return res.json({
                status: 200,
                message: "Device successfully added to battery"
            });
        } else {
            return res.json({
                status: 404,
                message: "Error in Adding Battery or Battery Not Found"
            });
        }
    }).catch((err) => {
        res.status(400).send(err);
    })
});






router.get('/devicedetail', verifyToken, async (req, res) => {


    const id = await req.userId;
    if (!id) {
        return res.json({
            status: 422,
            message: "Missing User ID"
        });
    }
   await cuser.findById(id, async (err, user) => {
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
        let email = user.email;
        console.log(email);
        let c = await ciot.find({
            user_email: email,
            battery_alloted: false
        }).select({
            device_id: 1
        });
        console.log(c);
        if(c.length===0)
        res.status(200).send("Not Found...");
        else
        res.status(200).send(c);

    });
    

});









//Route to Update Battery to Device
router.post('/battery-device-update', async (req, res) => {


    //Collect the Previous id
    async function f() {
        const r = await cbat.find({
            battery_id: req.body.battery_id
        }).select({
            device_id: 1
        });

        if (r.length === 0) {
            return res.json({
                status: 400,
                message: "Battery not found"
            });
        }
        const p = r[0].device_id;


        //Update the Battery and Device
        cbat.findOneAndUpdate({
            battery_id: req.body.battery_id
        }, {
            $push: {
                prev_device_id: p
            },
            $set: {
                device_id: req.body.device_id
            }
        }, {
            new: true
        }).then((result) => {
            if (result) {
                return res.json({
                    status: 200,
                    message: "Device successfully updated to battery"
                });
            } else {
                return res.json({
                    status: 400,
                    message: "Error in updating device to battery"
                });
            }
        }).catch((err) => {
            res.status(400).send(err);
        })
    }
    f();


});


module.exports = router;














































//  router.post('/battery-add',async (req,res)=>{
//     var batteryId = -1;

//     batteryIdCounter.findOne({ find: "Battery" }, async (err, response) => {
//         if (response) {
//             batteryId = response.count + 1;
//             response.count = batteryId;
//             await response.save(err => {
//                 if (err) {
//                     return res.json({ status: 500, message: "Internal server error" });
//                 }
//             });

//     const c=new cbat({
//         battery_id:batteryId,
//         temp:req.body.temp,
//         current:req.body.current,
//         voltage: req.body.voltage,
//         soh:req.body.soh,
//         soc:req.body.soc,
//         stat_level:req.body.stat_level,
//         location:req.body.location,
//         last_wall_id:req.body.last_wall_id,
//         other_info:req.body.other_info,
//         date:req.body.date,
//         time:req.body.time,
//     });
//         await c.save(err => {
//             if (err) {
//                 return res.json({ status: 500, message: "Internal server error" });
//             }
//             return res.json({
//                 status: 200,
//                 message: "Battery added successfully"

//             });})
//         }}); });
// router.post('/battery-update',async (req,res)=>{
//     cbat.findOneAndUpdate({battery_id:req.body.battery_id},{$set:{
//         temp:req.body.temp,
//         current:req.body.current,
//         voltage: req.body.voltage,
//         soh:req.body.soh,
//         soc:req.body.soc,
//         stat_level:req.body.stat_level,
//         location:req.body.location,
//         last_wall_id:req.body.last_wall_id,
//         other_info:req.body.other_info,
//         date:req.body.date,
//         time:req.body.time,
//      }},{new:true})   .then((result)=>{
//         if(result) {
//             res.status(200).send(result);
//         } else {
//             res.status(400).send(result);
//         }
//     }).catch((err)=>{
//         res.status(400).send(err);
//     })
// });