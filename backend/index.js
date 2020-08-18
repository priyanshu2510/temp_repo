const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const fs=require('fs');
const app = express();
const connectDB = require('./db/mongoose');
const controller = require('./routes/controller');
app.use(express.static('./admin'));
//database connection
connectDB();


//middleware
app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use('/*', controller);

app.get('/battery-add',(req,res)=>{
  var html = fs.readFileSync('./admin/battery-add.html', 'utf8')
  res.send(html);
});
app.get('/driver-add',(req,res)=>{
  var html = fs.readFileSync('./admin/driver-add.html', 'utf8')
  res.send(html);
});
app.get('/battery-device-add',(req,res)=>{
  var html = fs.readFileSync('./admin/battery-device-add.html', 'utf8')
  res.send(html);
});
app.get('/battery-device-update',(req,res)=>{
  var html = fs.readFileSync('./admin/battery-device-update.html', 'utf8')
  res.send(html);
});
//port setup
const port = 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});