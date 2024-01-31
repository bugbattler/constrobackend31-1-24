const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const roleSchema = new Schema({
    role : {type:String,default:null},
    permission:[{type:String}],
    isActive:{type:Boolean,default:true}
})

module.exports = mongoose.model('Role',roleSchema);