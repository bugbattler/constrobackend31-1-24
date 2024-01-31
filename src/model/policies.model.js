const mongoose = require('mongoose');
const Schema = mongoose.Schema; 


const PermissionSchema = new Schema({
    policy: { type: String, select: true },
    module: { type: String, select: true },
    policy_code: { type: String, select: true },
    isActive: { type: Boolean,default:true}
});

module.exports = mongoose.model("Policy", PermissionSchema);