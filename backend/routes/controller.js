 const express = require("express");
 const router = express.Router();
 var compression = require('compression')
 const moment = require('moment-timezone');
 const battery = require('./battery');
 const driver = require('./driver');
 const iot = require('./iot');
 const auth = require('./auth');
 const swap = require('./swapcontroller');
 const graph = require('./graphdata');
 const key = require('./api_key_gen');
 const table = require('./table');
 const total = require('./total');
 const message = require('./message');
 const user = require('./userdetails');
 const dist = require('./totaldist');
 const check = require('./check');
 const map = require('./map');
 router.use(compression())
 router.use('/battery', battery);
 router.use('/driver', driver);
 router.use('/iot', iot);
 router.use('/auth', auth);
 router.use('/swap', swap);
 router.use('/graph', graph);
 router.use('/table', table);
 router.use('/key', key);
 router.use('/total', total);
 router.use('/message', message);
 router.use('/user', user);
 router.use('/dist', dist);
 router.use('/check', check);
 router.use('/map', map);


 module.exports = router;