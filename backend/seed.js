const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.connect('mongourl')
.then(()=>console.log("connected to database..."))
.catch(err=> console.log("error whiel connecting to the database",err));
// const batteryIdCounterSchema = new Schema({
//     find: {
//         type: String,
//         default: 'Battery'
//     },
//     count: {
//         type: Number,
//         default: 300000001
//     }
// });
const totalSchema = new Schema({
    name: {
        type: String,
        default: "total"
    },
    distance: {
        type: Number,
        default: 0
    },
    details: {
        total_distance: {
            type: Number,
            default: 0
        },
        time: {
            type: String,
            default: null
        },
        date: {
            type: String,
            default: null
        }
    }
});

const totalModel = mongoose.model('totaldistance', totalSchema);

//const BatteryIdCounter = mongoose.model('batteryidcounters', batteryIdCounterSchema);
async function p(){ 
let au= new  totalModel({
});
const result=await au.save();
    console.log(result);}
    p();





















    // const driverIdCounterSchema = new Schema({
    //     find: {
    //         type: String,
    //         default: 'USER'
    //     },
    //     count: {
    //         type: Number,
    //         default: 400000001
    //     }
    // });
    
    // const DriverIdCounter = mongoose.model('driveridcounters', driverIdCounterSchema);
    // async function c(){ 
    // let au= new  DriverIdCounter({
    //     count:400000001
    // });
    // const result=await au.save();
    //     console.log(result);}
      //  c();