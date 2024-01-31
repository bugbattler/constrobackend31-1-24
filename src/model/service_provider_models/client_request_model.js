const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const objSchema = new Schema({
    providerId : { type: Schema.Types.ObjectId, ref: "Service_Provider", default: null },
    receiverId : { type: Schema.Types.ObjectId, ref: "Service_Receiver", default:null },
    isAccepted : { type: Boolean, default: false },
    lastModified:{type:Date, default:Date.now},
    isActive : { type: Boolean, default: true }
})
module.exports = mongoose.model('Client_Request',objSchema);