const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const objSchema = new Schema ( {
    category: {type: String, default: null},
    lastModified: { type: Date, default: Date.now },
    isActive: {type: Boolean, default: true}
})

module.exports = mongoose.model('Category', objSchema);     