var compression = require('compression')
const express = require('express');
const router = express.Router();
const http = require('http');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const moment = require('moment-timezone');
const ciot = require("../models/batteryback");
const cbat = require('../models/batteryfront');
const ciotarray = require('../models/iotarray');
const ctotaldistance = require('../models/totaldistance');
const app = express();
const server = http.createServer(app);
const api_call = require('../utils/callmapapi');
const {
  compare
} = require('bcryptjs');

router.use(compression())


let flag = 0;



//Route to get all iot device details
router.get('/iot-stats', async (req, res) => {
  const c = await ciot.find();
  res.status(200).send(c);
});




//Route to get an iot device Details
router.get('/iot-stats/:id', async (req, res) => {
  const c = await ciot.find({
    device_id: req.params.id
  });
  res.status(200).send(c);
});




//Route to add Device 
router.post('/iot-add', async (req, res) => {


  //Create New Device Schema
  const c = new ciot({
    mac_id: req.body.mac_id,
    device_id: req.body.device_id,
    user_email: req.body.email,
    date: moment().tz("Asia/Kolkata").format('L'),
    time: moment().tz("Asia/Kolkata").format('HH:mm:ss'),
  });


  //Create New Device array Schema
  ciotarray.create({
    device_id: req.body.device_id
  }, (err, user) => {
    if (err) {
      console.log(err);
      return res.json({
        status: 500,
        message: "Something went wrong while registering the device, please try again"
      });
    }
  });


  await c.save(err => {
    if (err) {
      console.log(err);
      return res.json({
        status: 500,
        message: "Internal server error"
      });
    }
    return res.json({
      status: 200,
      message: "Iot Device added successfully"

    });
  })
});




//Route to Update Iot Device Data
router.get('/iot-update/:device_id/:lattitude/:longitude/:current/:voltage/:soc/:soh/:capah/:temp1/:temp2/:temp3/:temp4/:c1/:c2/:c3/:c4/:c5/:c6/:c7/:c8/:c9/:c10/:c11/:c12/:c13/:c14/:c15/:c16/:c17/:c18/:c19/:c20/:cycleCount/:gpsSpeed/:satelliteCount/:date/:time', async (req, res) => {


  //Check if Device Exists
  const b = await ciot.find({
    device_id: req.params.device_id
  });
  if (b.length === 0) {
    return res.json({
      status: 400,
      message: "Device not found"
    });
  }


  //Check if Device Exists in  Array
  const bb = await ciotarray.find({
    device_id: req.params.device_id
  });
  if (bb.length === 0) {
    return res.json({
      status: 400,
      message: "Device not found in array"
    });
  }


  //Calculate the lat long in desired format
  let counta = -1;
  counta = (bb[0].count + 1);
  let e = 0.0;
  let d = 0.0;
  let f = 0.0;
  let lat1 = b[0].lattitude;
  e = lat1;
  d = (e % 10000) / 100;
  e = Math.floor(e / 10000);
  f = e % 100;
  e = Math.floor(e / 100);
  lat1 = e + (f / 60) + (d / 3600);
  //
  let long1 = b[0].longitude;
  e = long1;
  d = (e % 10000) / 100;
  e = Math.floor(e / 10000);
  f = e % 100;
  e = Math.floor(e / 100);
  long1 = e + (f / 60) + (d / 3600);
  //
  let lat2 = req.params.lattitude;
  e = lat2;
  d = (e % 10000) / 100;
  e = Math.floor(e / 10000);
  f = e % 100;
  e = Math.floor(e / 100);
  lat2 = e + (f / 60) + (d / 3600);
  //
  let long2 = req.params.longitude;
  e = long2;
  d = (e % 10000) / 100;
  e = Math.floor(e / 10000);
  f = e % 100;
  e = Math.floor(e / 100);
  long2 = e + (f / 60) + (d / 3600);


  //Check if Battery and Device are linked
  const bk = await cbat.find({
    device_id: req.params.device_id
  });
  if (bk.length === 0) {
    return res.json({
      status: 400,
      message: "Battery Device not Linked..."
    });
  }


  let so = bk[0].voltage;
  let v = (req.params.c1 / 4) + (req.params.c2 / 4) + (req.params.c3 / 4) + (req.params.c4 / 4);
  let sooh = (req.params.voltage / so) * 100;
  let cp = 0;


  //Calculate Distance Bettween two points
  await api_call.make_API_call(`https://router.hereapi.com/v8/routes?transportMode=car&origin=${lat1},${long1}&destination=${lat2},${long2}&return=summary&apiKey=mfu4WVuiEOpiNv0CZFbdgCtBDzcOJUMqDJkhSGns3-k`)
    .then((response) => {
      cp = response.routes[0].sections[0].summary.length;
    })
    .catch(error => {
      console.log(error);
    })


  //Call api for the battery table
  api_call.make_API_call(`http://54.212.85.133/api/table/battery?soc=${req.params.soc}&device_id=${req.params.device_id}`)



  let dp = bk[0].total_distance;
  dp = dp + (cp / 1000);
  let tsoc = Math.exp(((v - 2.9549) / 0.2683));
  let dis = 0;


  ctotaldistance.findOne({
    name: 'total'
  }, async (err, dist) => {
    if (err) {
      return res.json({
        status: 500,
        message: "Internal server errorx"
      });
    } else if (!dist) {
      return res.json({
        status: 404,
        message: "Not Found total..."
      });
    } else {
      dis = dist.distance;
      dis = dis + (cp / 1000);
      dist.distance = dis
      await dist.save(err => {
        if (err) {
          console.log(err);
          return res.json({
            status: 500,
            message: "Internal server errorx"
          });
        }
      });
    }
  });


  if (flag % 50 == 0) {
    flag = flag + 1;
    ctotaldistance.findOneAndUpdate({
      name: 'total'
    }, {
      $push: {
        details: {
          total_distance: dis,
          date: moment().tz("Asia/Kolkata").format('L'),
          time: moment().tz("Asia/Kolkata").format('HH:mm:ss'),
        }
      },
    }, {
      new: true
    }).then((result) => {

      if (!result) {
        res.status(400).send(result);
      }
    }).catch((err) => {
      res.status(400).send(err);
    })
  } else {
    flag = flag + 1;
  }


  //Update the iot Details
  ciotarray.findOneAndUpdate({
    device_id: req.params.device_id
  }, {
    $push: {
      details: {
        device_id: req.params.device_id,
        lattitude: req.params.lattitude,
        longitude: req.params.longitude,
        current: req.params.current,
        voltage: req.params.voltage,
        soc: req.params.soc,
        theo_soc: tsoc,
        soh: sooh,
        iot_soh: req.params.soh,
        CapAh: req.params.capah,
        temp1: req.params.temp1,
        temp2: req.params.temp2,
        temp3: req.params.temp3,
        temp4: req.params.temp4,
        cycleCount: req.params.cycleCount,
        gpsSpeed: req.params.gpsSpeed,
        satelliteCount: req.params.satelliteCount,
        date: moment().tz("Asia/Kolkata").format('L'),
        time: moment().tz("Asia/Kolkata").format('HH:mm:ss'),
      }
    },
    $set: {
      count: counta
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


  // Device data update
  ciot.findOneAndUpdate({
    device_id: req.params.device_id
  }, {
    $set: {
      lattitude: req.params.lattitude,
      longitude: req.params.longitude,
      current: req.params.current,
      voltage: req.params.voltage,
      soc: req.params.soc,
      theo_soc: tsoc,
      soh: sooh,
      iot_soh: req.params.soh,
      CapAh: req.params.capah,
      temp1: req.params.temp1,
      temp2: req.params.temp2,
      temp3: req.params.temp3,
      temp4: req.params.temp4,
      c1: req.params.c1,
      c2: req.params.c2,
      c3: req.params.c3,
      c4: req.params.c4,
      c5: req.params.c5,
      c6: req.params.c6,
      c7: req.params.c7,
      c8: req.params.c8,
      c9: req.params.c9,
      c10: req.params.c10,
      c11: req.params.c11,
      c12: req.params.c12,
      c13: req.params.c13,
      c14: req.params.c14,
      c15: req.params.c15,
      c16: req.params.c16,
      c17: req.params.c17,
      c18: req.params.c18,
      c19: req.params.c19,
      c20: req.params.c20,
      cycleCount: req.params.cycleCount,
      gpsSpeed: req.params.gpsSpeed,
      satelliteCount: req.params.satelliteCount,
      date: moment().tz("Asia/Kolkata").format('L'),
      time: moment().tz("Asia/Kolkata").format('HH:mm:ss'),
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


  let t = (req.params.temp1) / 2;
  let dd = (req.params.temp2) / 2;
  let tt = t + dd;

  //Battery data update
  cbat.findOneAndUpdate({
    device_id: req.params.device_id
  }, {
    $set: {
      location: {
        lattitude: req.params.lattitude,
        longitude: req.params.longitude,
      },
      temp: tt,
      current: req.params.current,
      soh: sooh,
      soc: req.params.soc,
      energy_percent: req.params.soc,
      cycle_count: req.params.cycleCount,
      date: moment().tz("Asia/Kolkata").format('L'),
      time: moment().tz("Asia/Kolkata").format('HH:mm:ss'),
      total_distance: dp,
    }
  }, {
    new: true
  }).then((result) => {
    if (result) {
      return res.json({
        status: 200,
        message: "Battery state updated successfuly"

      });
    } else {
      res.status(402).send(result);
    }
  }).catch((err) => {
    res.status(401).send(err);
  })

});

module.exports = router;