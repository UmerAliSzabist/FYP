const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let paymentDetailsSchema = new Schema({
    userId: { type: Schema.Types.ObjectId },
    cardNumber: { type: String },
    nameOfCard: { type: String  },
    expiration: { type: String },
    cvvNumber: { type: String  },
    securityDeposite: { type: Number, default: 0},
});

module.exports = mongoose.model('PaymentDetails', paymentDetailsSchema);