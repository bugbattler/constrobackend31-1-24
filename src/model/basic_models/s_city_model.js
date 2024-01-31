var mongoose = require('mongoose'); // Import Mongoose Package
var Schema = mongoose.Schema; // Assign Mongoose Schema function to variable
var titlize = require('mongoose-title-case'); // Import Mongoose Title Case Plugin

var CitySchema = new Schema({
    city: { type: String, required: true},
    stateID: { type:Schema.Types.ObjectId,default:null,ref:"S_State"},
    isActive: { type : Boolean, default: true},
    regOn: {type:Date,default:Date.now},
});

// Mongoose Plugin to change fields to title case after saved to database (ensures consistency)
CitySchema.plugin(titlize, {
  paths: ['city']
});


module.exports=mongoose.model("S_City",CitySchema);

