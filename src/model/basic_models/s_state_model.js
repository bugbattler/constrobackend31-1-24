var mongoose = require('mongoose'); // Import Mongoose Package
var Schema = mongoose.Schema; // Assign Mongoose Schema function to variable
var titlize = require('mongoose-title-case'); // Import Mongoose Title Case Plugin


var StateSchema = new Schema({
  state: { type: String, required: true},
  isActive: { type : Boolean, default: true},
  regOn: {type:Date,default:Date.now},
});


// Mongoose Plugin to change fields to title case after saved to database (ensures consistency)
StateSchema.plugin(titlize, {
  paths: ['state']
});


module.exports=mongoose.model("S_State",StateSchema);

