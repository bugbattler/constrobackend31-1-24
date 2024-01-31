const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const objSchema = new Schema ({
    categoryId: {type: Schema.Types.ObjectId, default:null, ref:'Category'},
    expertise: {type: String, default: null},
    lastModified: { type: Date, default: Date.now },
    isActive: {type: Boolean, default: true}
})

module.exports = mongoose.model('Expertise', objSchema);