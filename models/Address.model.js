const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let addressSchema = new Schema({
    houseNo: { type: String },
    streetNo: { type: String },
    nearBy: { type: String },
});

module.exports = mongoose.model('Address', addressSchema);