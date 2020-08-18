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
const ctotaldistance = require('../models/totaldistance');
const cbatterytable = require('../models/battery_table');
const {
  response
} = require('express');

router.use(compression())

router.get('/battery', async (req, res) => {

  let soc = req.query.soc;
  let device_id = req.query.device_id;
  console.log(soc);
  console.log(device_id);
  cbatterytable.findOne({
    device_id: device_id
  }, async (err, table) => {
    if (err) {
      return res.json({
        status: 500,
        message: "Internal server error"
      });
    } else if (!table) {
      return res.json({
        status: 404,
        message: "Table not intiliazed.."
      });
    } else {
      let charge = table.charging_time;
      let discharge = table.discharging_time;
      if (charge == 0 && discharge == 0) {
        table.previous_soc = soc;
        table.discharging_time = 1;
        table.charging_time = 1;
        table.time = moment().tz("Asia/Kolkata").format('HH:mm:ss');
        table.date = moment().tz("Asia/Kolkata").format('L');

        await table.save(err => {
          if (err) {
            console.log(err);
            return res.json({
              status: 500,
              message: "Internal server error"
            });
          }
          return res.json({
            status: 200,
            message: `Initial time added`

          });
        });
      }
      let timethen = table.time;
      let timenow = moment().tz("Asia/Kolkata").format('HH:mm:ss');
      var ms = moment(timenow, "HH:mm:ss").diff(moment(timethen, "HH:mm:ss"));
      var d = moment.duration(ms);
      var time_diff = (((d.hours()) % 24) * 3600) + (((d.minutes()) % 60) * 60) + (d.seconds()) % 60;
      if (soc > table.previous_soc) {
        if (charge > 0) {
          charge = charge + time_diff;
          table.previous_soc = soc;
          table.discharging_time = 0;
          table.charging_time = charge;
          table.time = moment().tz("Asia/Kolkata").format('HH:mm:ss');
          table.date = moment().tz("Asia/Kolkata").format('L');

          await table.save(err => {
            if (err) {
              console.log(err);
              return res.json({
                status: 500,
                message: "Internal server error"
              });
            }
            return res.json({
              status: 200,
              message: `Charging time increased`

            });
          });
        } else if (discharge > 0) {
          charge = charge + time_diff;
          table.previous_soc = soc;
          table.discharging_time = 0;
          table.charging_time = charge;
          table.time = moment().tz("Asia/Kolkata").format('HH:mm:ss');
          table.date = moment().tz("Asia/Kolkata").format('L');
          await table.save(err => {
            if (err) {
              console.log(err);
              return res.json({
                status: 500,
                message: "Internal server error"
              });
            }
          });
          await cbat.updateOne({
            device_id: device_id
          }, {
            $push: {
              details: {
                last_position: `USER-1001`,
                energy_percent: soc,
                cdtime: discharge,
                last_activity_time: {
                  date: moment().tz("Asia/Kolkata").format('L'),
                  time: moment().tz("Asia/Kolkata").format('HH:mm:ss')
                }
              }
            }
          });
          return res.json({
            status: 200,
            message: `Discharging time added to the table`

          });

        }
      } else if (soc < table.previous_soc) {
        if (charge > 0) {
          discharge = discharge + time_diff;
          table.previous_soc = soc;
          table.charging_time = 0;
          table.discharging_time = discharge;
          table.time = moment().tz("Asia/Kolkata").format('HH:mm:ss');
          table.date = moment().tz("Asia/Kolkata").format('L');
          await table.save(err => {
            if (err) {
              console.log(err);
              return res.json({
                status: 500,
                message: "Internal server error"
              });
            }
          });
          await cbat.updateOne({
            device_id: device_id
          }, {
            $push: {
              details: {
                last_position: `Wall-1001`,
                energy_percent: soc,
                cdtime: charge,
                last_activity_time: {
                  date: moment().tz("Asia/Kolkata").format('L'),
                  time: moment().tz("Asia/Kolkata").format('HH:mm:ss')
                }
              }
            }
          });
          return res.json({
            status: 200,
            message: `Charging time added to the table`

          });
        } else if (discharge > 0) {
          discharge = discharge + time_diff;
          table.previous_soc = soc;
          table.charging_time = 0;
          table.discharging_time = discharge;
          table.time = moment().tz("Asia/Kolkata").format('HH:mm:ss');
          table.date = moment().tz("Asia/Kolkata").format('L');

          await table.save(err => {
            if (err) {
              console.log(err);
              return res.json({
                status: 500,
                message: "Internal server error"
              });
            }
            return res.json({
              status: 200,
              message: `Discharging time increased`

            });
          });
        }

      } else {
        if (charge > 0) {
          charge = charge + time_diff;
          table.previous_soc = soc;
          table.discharging_time = 0;
          table.charging_time = charge;
          table.time = moment().tz("Asia/Kolkata").format('HH:mm:ss');
          table.date = moment().tz("Asia/Kolkata").format('L');

          await table.save(err => {
            if (err) {
              console.log(err);
              return res.json({
                status: 500,
                message: "Internal server error"
              });
            }
            return res.json({
              status: 200,
              message: `Charging time increaseds`

            });
          });
        } else if (discharge > 0) {
          discharge = discharge + time_diff;
          table.previous_soc = soc;
          table.chargeing_time = 0;
          table.discharging_time = discharge;
          table.time = moment().tz("Asia/Kolkata").format('HH:mm:ss');
          table.date = moment().tz("Asia/Kolkata").format('L');

          await table.save(err => {
            if (err) {
              console.log(err);
              return res.json({
                status: 500,
                message: "Internal server error"
              });
            }
            return res.json({
              status: 200,
              message: `Discharging time increaseds`

            });
          });
        }



      }
    }
  });
});








































//     cbat.findOne({
//       device_id: device_id
//     }, async (err, battery) => {
//       if (err) {
//         console.log(err);
//         return res.json({
//           status: 500,
//           message: "Internal server error"
//         });
//       } else {
//         battery.current_location = `Wall-1001`;
//         await cbat.updateOne({
//           device_id: device_id
//         }, {
//           $push: {
//             details: {
//               last_position: `USER-1001`,
//               energy_percent: soc,
//               cdtime: 3.3,
//               last_activity_time: {
//                 date: moment().tz("Asia/Kolkata").format('L'),
//                 time: moment().tz("Asia/Kolkata").format('HH:mm:ss')
//               }
//             }
//           }
//         });
//         await battery.save(err => {
//           if (err) {
//             console.log(err);
//             return res.json({
//               status: 500,
//               message: "Internal server error"
//             });
//           }
//           return res.json({
//             status: 200,
//             message: `Battery Collected successfully  with id ${d} `

//           });
//         });
//       }
//     });



//   }
// });
// } else {
// cdriv.findOne({
//   driver_id: driver_id
// }, async (err, driver) => {
//   if (err) {
//     return res.json({
//       status: 500,
//       message: "Internal server error"
//     });
//   } else if (!driver) {
//     return res.json({
//       status: 404,
//       message: "Driver not found"
//     });
//   } else {
//     let driverbatteryid = driver.current_battery_id;
//     const c1 = await cbat.find({
//       battery_id: driverbatteryid
//     });
//     if (c1.length === 0) {
//       return res.json({
//         status: 404,
//         message: "No battery Found for this Driver"
//       })
//     }
//     let distance = c1[0].true_range;
//     driver.battery_alloted = false;
//     driver.current_battery_id = null;
//     driver.total_payement += 100;
//     driver.total_distance += distance;

//     await cdriv.updateOne({
//       driver_id: driver_id
//     }, {
//       $push: {
//         details: {
//           battery_id: driverbatteryid,
//           wall_id: wall_id,
//           distance_travelled: distance,
//           payment: 100,
//           last_activity_time: {
//             date: moment().tz("Asia/Kolkata").format('L'),
//             time: moment().tz("Asia/Kolkata").format('HH:mm:ss')
//           }
//         }
//       }
//     });
//     await driver.save(err => {
//       if (err) {
//         return res.json({
//           status: 500,
//           message: "Internal server error"
//         });
//       }
//     });
//     cbat.findOne({
//       battery_id: driverbatteryid
//     }, async (err, battery) => {
//       if (err) {
//         return res.json({
//           status: 500,
//           message: "Internal server error"
//         });
//       } else {
//         battery.current_location = wall_id;
//         battery.battery_in_use = false;

//         await cbat.updateOne({
//           battery_id: driverbatteryid
//         }, {
//           $push: {
//             details: {
//               last_position: "USER-" + driver_id,
//               energy_percent: battery.soc,
//               cdtime: 4.2,
//               last_activity_time: {
//                 date: moment().tz("Asia/Kolkata").format('L'),
//                 time: moment().tz("Asia/Kolkata").format('HH:mm:ss')
//               }
//             }
//           }
//         });
//         await battery.save(err => {
//           if (err) {
//             return res.json({
//               status: 500,
//               message: "Internal server error"
//             });
//           }
//           return res.json({
//             status: 200,
//             message: "Battery Submitted Sucessfully "

//           });
//         });
//       }
//     });

//   }
// })
// }

// }
// });

// });


module.exports = router;