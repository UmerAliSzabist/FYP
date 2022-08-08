const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let rentProductSchema = new Schema({
    userId: { type: Schema.Types.ObjectId , required:true, ref: "User" },
    productId: { type: Schema.Types.ObjectId, required:true  },
    riderId: { type: Schema.Types.ObjectId, ref: "User"},
    trackingId: { type: String },
    name: { type: String, required:true },
    title: { type: String, required:true },
    category: { type: String, required:true },
    mobileNumber: { type: String, required:true  },
    city: { type: String, required:true  },
    address: {type: Schema.Types.ObjectId, ref: "Address"},
    price: { type: String,required:true  },
    numberOfDays: { type: String,required:true },
    image: {type: String, required:true },
    rentDate: { type: Date, default: Date.now },
    returnDate: { type: Date },
    status: { type: String, default: "Pending" },
    deliveryStatus: { type: String, default: "Pending" },
    paymentStatus: { type: String, default: "Paid" }
});

module.exports = mongoose.model('RentedProduct', rentProductSchema);