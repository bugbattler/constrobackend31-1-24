const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Float = require('mongoose-float').loadType(mongoose);

const objSchema = new Schema({
    tenderId: {type: Schema.Types.ObjectId, default: null, ref: 'Tender_Registartion'},
    receiverId: {type: Schema.Types.ObjectId, default: null, ref: 'Service_Receiver'},
    providerId: {type: Schema.Types.ObjectId, default:null, ref:'Service_Provider'},
    status: {type: String, default: "applied"},
    isAccepted: {type: Boolean, default: false},
    appliedOn: { type: Date, default: Date.now },
    acceptedOn: {type: Date, default: null},
    isActive:{type:Boolean, default: true}
});
module.exports = mongoose.model('Tender_Application', objSchema);