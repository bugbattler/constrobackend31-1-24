const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs'); // Import Bcrypt Package
var titlize = require('mongoose-title-case');
// const { JsonWebTokenError } = require('jsonwebtoken');
const jwt=require('jsonwebtoken');
const userSchema = new Schema({
    name: { type: String, default: null },
    email: { type: String, lowecase: true, default: null },
    mobile: { type: String, lowecase: true, default: null },
    password: { type: String, default: null },
    gender: { type: String, default: 'male' },
    profile: { type: String, default: null },
    roleID: { type: Schema.Types.ObjectId, ref: "Role", default: null },
    address: {
        stateID: { type: Schema.Types.ObjectId, ref: "S_State", default: null },
        cityID: { type: Schema.Types.ObjectId, ref: "S_City", default: null },
        pincode: { type: String, default: null },
        address: { type: String, default: null }
    },
    source: { type: String, default: 'mobile' },   // source of registered form data f.e 'web' / 'mobile'
    regOn: { type: Date, default: Date.now },

    editOn: { type: Date, default: null },
    temporarytoken: { type: String, default: null },
    fcmToken: { type: String, default: null },   //firebase push notifications  Android
    fcmToken_web: { type: String, default: null },  //firebase push notifications web
    resettoken: { type: String, required: false, default: null },
    isActive: { type: Boolean, default: true },
});

userSchema.plugin(titlize, {
    paths: ['name']
});

// Middleware to ensure password is encrypted before saving user to database
userSchema.pre('save', function (next) {
    var retailer = this;

    if (!retailer.isModified('password')) return next(); // If password was not changed or is new, ignore middleware

    // Function to encrypt password 
    bcrypt.hash(retailer.password, null, null, function (err, hash) {
        if (err) return next(err); // Exit if error is found
        retailer.password = hash; // Assign the hash to the user's password so it is saved in database encrypted
        next(); // Exit Bcrypt function
    });
});

// Method to compare passwords in API (when user logs in) 
userSchema.methods.comparePassword = function (password) {
    console.log("compare compare --> " + bcrypt.compareSync(password, this.password));
    return bcrypt.compareSync(password, this.password);
};

// userSchema.methods.verifyPassword =function (password){
//     return bcrypt.compareSync(password,this.password)
// }
// userSchema.methods.generateJwt = function(){
//     return jwt.sign({_id:this._id},
//         process.env.JWT_SECRET);
// }

module.exports = mongoose.model("User_Admin", userSchema);