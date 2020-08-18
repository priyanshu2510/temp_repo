var compression = require('compression')
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const moment =require('moment-timezone');
const mongoose = require('mongoose');
const batteryIdCounter = require("../models/battery_id");
const cbat = require('../models/batteryfront');
const ciot = require("../models/batteryback");
const cuser = require("../models/user");
const cdriv = require('../models/driverfront');
const sendEmail = require('../utils/sendemail');
const sendPM = require('../utils/sendPM');
const verifyToken = require("../utils/verifyToken");
router.use(compression())

router.post('/check', async (req, res) => {
  let driver_id = req.body.driver_id;
  let wall_id = req.body.wall_id;
  cdriv.findOne({
    driver_id: driver_id
  }, async (err, driver) => {
    if (err) {
      return res.json({
        status: 500,
        message: "Internal server error"
      });
    } else if (!driver) {
      return res.json({
        status: 404,
        message: "Driver not found"
      });
    } else {
      if (!driver.battery_alloted) {
        const c = await cbat.find({
          battery_in_use: {
            "$in": ["false", false]
          },
          current_location: wall_id
        }).select({
          battery_id: 1
        });
        cdriv.findOne({
          driver_id: driver_id
        }, async (err, driver) => {
          if (err) {
            return res.json({
              status: 500,
              message: "Internal server error"
            });
          } else if (!driver) {
            return res.json({
              status: 404,
              message: "Driver not found"
            });
          } else {
            if (c.length === 0) {
              return res.json({
                status: 404,
                message: "No battery Found for this Wall"
              })
            }
            driver.battery_alloted = true;
            let d = c[0].battery_id;
            driver.current_battery_id = d;
            let k = driver.total_swaps;
            driver.total_swaps = k + 1;
            await driver.save(err => {
              if (err) {
                return res.json({
                  status: 500,
                  message: "Internal server error"
                });
              }
            });
            cbat.findOne({
              battery_id: d
            }, async (err, battery) => {
              if (err) {
                console.log(err);
                return res.json({
                  status: 500,
                  message: "Internal server error"
                });
              } else {
                battery.current_location = `USER-${driver_id}`;
                let pp = battery.swaps;
                battery.swaps = pp + 1;
                battery.battery_in_use = true;
                await cbat.updateOne({
                  battery_id: d
                }, {
                  $push: {
                    details: {
                      last_position: wall_id,
                      energy_percent: battery.soc,
                      cdtime: 3.3,
                      last_activity_time: {
                        date: moment().tz("Asia/Kolkata").format('L'),
                        time: moment().tz("Asia/Kolkata").format('HH:mm:ss')
                      }
                    }
                  }
                });
                await battery.save(err => {
                  if (err) {
                    console.log(err);
                    return res.json({
                      status: 500,
                      message: "Internal server error"
                    });
                  }
                  return res.json({
                    status: 200,
                    message: `Battery Collected successfully  with id ${d} `

                  });
                });
              }
            });



          }
        });
      } else {
        cdriv.findOne({
          driver_id: driver_id
        }, async (err, driver) => {
          if (err) {
            return res.json({
              status: 500,
              message: "Internal server error"
            });
          } else if (!driver) {
            return res.json({
              status: 404,
              message: "Driver not found"
            });
          } else {
            let driverbatteryid = driver.current_battery_id;
            const c1 = await cbat.find({
              battery_id: driverbatteryid
            });
            if (c1.length === 0) {
              return res.json({
                status: 404,
                message: "No battery Found for this Driver"
              })
            }
            let distance = c1[0].true_range;
            driver.battery_alloted = false;
            driver.current_battery_id = null;
            driver.total_payement += 100;
            driver.total_distance += distance;

            await cdriv.updateOne({
              driver_id: driver_id
            }, {
              $push: {
                details: {
                  battery_id: driverbatteryid,
                  wall_id: wall_id,
                  distance_travelled: distance,
                  payment: 100,
                  last_activity_time: {
                    date: moment().tz("Asia/Kolkata").format('L'),
                    time: moment().tz("Asia/Kolkata").format('HH:mm:ss')
                  }
                }
              }
            });
            await driver.save(err => {
              if (err) {
                return res.json({
                  status: 500,
                  message: "Internal server error"
                });
              }
            });
            cbat.findOne({
              battery_id: driverbatteryid
            }, async (err, battery) => {
              if (err) {
                return res.json({
                  status: 500,
                  message: "Internal server error"
                });
              } else {
                battery.current_location = wall_id;
                battery.battery_in_use = false;

                await cbat.updateOne({
                  battery_id: driverbatteryid
                }, {
                  $push: {
                    details: {
                      last_position: "USER-" + driver_id,
                      energy_percent: battery.soc,
                      cdtime: 4.2,
                      last_activity_time: {
                        date: moment().tz("Asia/Kolkata").format('L'),
                        time: moment().tz("Asia/Kolkata").format('HH:mm:ss')
                      }
                    }
                  }
                });
                await battery.save(err => {
                  if (err) {
                    return res.json({
                      status: 500,
                      message: "Internal server error"
                    });
                  }
                  return res.json({
                    status: 200,
                    message: "Battery Submitted Sucessfully "

                  });
                });
              }
            });

          }
        })
      }

    }
  });

});


module.exports = router;
