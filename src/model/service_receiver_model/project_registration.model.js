const mongoose = require('mongoose');
const Schema =mongoose.Schema;

const objSchema = new Schema({
    regNo:{type:String,default:null},
    receiverId:{type: Schema.Types.ObjectId, ref: "Service_Receiver", default: null},
    buildings:[{type:String,default:null}],
    projectName:{type:String,default:null},
    city: {type: Schema.Types.ObjectId, ref: "S_City", default: null},
    location: {type: String, default: null},
    remark: {type: String, default: null},
    regFrom:{type:String,default:'Web'},
    regOn: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
})

module.exports = mongoose.model('Project_Registration',objSchema);