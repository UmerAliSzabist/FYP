const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let postAdSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required:true },
    image: { type: String, required:true },
    category: { type: String, required:true },
    mobileNumber: { type: String, required:true },
    price: { type: String, required:true },
    description: { type: String, required:true },
    address: {type: Schema.Types.ObjectId, ref: "Address"},
    startDate: { type: Date, default: Date.now },
    status: { type: String, default: "Pending" }
});

module.exports = mongoose.model('PostAd', postAdSchema);