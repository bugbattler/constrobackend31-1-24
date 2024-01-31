const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validate = require("mongoose-validator");
const bcrypt = require("bcrypt-nodejs"); 
const Float = require('mongoose-float').loadType(mongoose);

const objSchema = new Schema({
    userCode: { type: String, default: null },
    userName: { type: String, default: null },
    profile:{type:String,default:null},
    mobile: { type: String, default: null },
    alternateMobile: {type: String, default: null},
    email: {type: String, lowercase: true, default: null},
    password: { type: String, default: null },
    categoryId: { type: Schema.Types.ObjectId, default: null, ref: 'Category' },
    categoryType: {type: String, default: null},
    // expertiseId: [{ type: Schema.Types.ObjectId, default: null, ref: 'Expertise' }],
    firmName: {type: String, default: null},
    // firmType: {type: String, default: null},
    firmRepresentative: {type: String, default: null},
    representativeDesignation: {type: String, default: null},
    // representativeEducation: {type: String, default: null},
    website: {type: String, default: null},
    address: {
        stateID: { type: Schema.Types.ObjectId, ref: "S_State", default: null },
        cityID: { type: Schema.Types.ObjectId, ref: "S_City", default: null },
        pincode: { type: String, default: null },
        address: { type: String, default: null }
    },
    preferredCities:[{type: Schema.Types.ObjectId, default: null, ref: 'S_City'}],
    yearOfEst: {type: String, default: null},        //year of establishment
    // isGSTAvail:{type:Boolean,default:false},
    // gstNo: {type: String, default: null},
    // isPFAvail:{type:Boolean,default:false},
    // pfNo: {type: String, default: null},
    // isPANAvail:{type:Boolean,default:false},
    // panNo: {type: String, default: null},
    remark: {type: String, default: null},
    fcmToken: { type: String, default: null },
    regFrom: {type: String, default: 'Web'},        //App or Web
    regOn: { type: Date, default: Date.now },
    lastModified:{type:Date, default:Date.now},
    isActive: { type: Boolean, default: true },
    docs:[
        {
            name: {type: String, default: null},
            url: {type: String, default: null}
        }
    ]
})


// Middleware to ensure password is encrypted before saving user to database
objSchema.pre("save", function (next) {
    var user = this;

    if (!user.isModified("password")) return next();  // If password was not changed or is new, ignore middleware

    //Function to encypt password
    bcrypt.hash(user.password, null, null, function (err, hash) {
        if (err) return next(err); // Exit if error found
        user.password = hash; // Assign the hash to the User's password so it is saved in database encrypted
        next();  //Exit Bcrypt function
    });
});

// Method to compare passwords in API (when user logs in)
objSchema.methods.comparePassword = function (password) {
    console.log(
        "compare compare --> " + bcrypt.compareSync(password, this.password)
    );

    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Service_Receiver', objSchema);