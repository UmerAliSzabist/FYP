const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

let userSchema = new Schema({
    name: { type: String },
    email: { type: String },
    cnic: { type: String},
    mobileNumber: { type: String },
    address: {type: Schema.Types.ObjectId, ref: "Address"},
    password: { type: String },
    cPassword: {type: String},
    userType: { type:String, default: 'user'},
    status: { type: String, default: "Active" }
});

userSchema.pre('save', async function (next) {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    if(this.isModified('cPassword')) {
        this.cPassword = await bcrypt.hash(this.cPassword, 12);
    }
    next(); 
});

module.exports = mongoose.model('User', userSchema);