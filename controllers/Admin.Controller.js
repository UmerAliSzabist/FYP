const User = require('../models/User.model');
const Address = require('../models/Address.model')
const PostAd = require('../models/PostAd.model')
const bcrypt = require('bcryptjs');
const RentedProducts = require('../models/RentedProducts');
const PaymentDetails = require('../models/PaymentDetails');

const mongoose = require('mongoose');

exports.addRider = async (req, res, next) => {

    const riderExist = await User.findOne({ email: req.body.email });

    const id = new mongoose.Types.ObjectId();

    if (riderExist) {
        return res.status(422).send("Rider Already Exist")
    }

    let address = new Address({
        houseNo: req.body.houseNo,
        streetNo: req.body.streetNo,
        nearBy: req.body.nearBy
    });

    address.save((err, address) => {
        if (err) return next(err);
        let user = new User({
            name: req.body.name,
            email: req.body.email,
            cnic: req.body.cnic,
            mobileNumber: req.body.mobileNumber,
            address: address._id,
            password: req.body.password,
            userType: req.body.userType
        });

        user.save((err) => {
            if (err) return next(err);
            res.status(201).send("Rider created successfully");
        });

    });
};

exports.ads = ((req, res, next) => {

    PostAd.aggregate([
        {
            $match: {
                status: "Pending"
            }
        }
    ], (error, response) => {
        if (error) return next(error)
        res.send(response)
    })
});

exports.RentedProducts = ((req, res, next) => {

    RentedProducts.aggregate([
        {
            $match: {
                deliveryStatus: "Pending",
                status: "Pending"
            }
        }
    ], (error, response) => {
        if (error) return next(error)
        res.send(response)
    })
});

exports.RentedProductDetails = ((req, res, next) => {

    RentedProducts.findById(req.params.id).populate("userId").populate("address").populate("riderId").exec((err, adDetail) => {
        if (err) return next(err);
        res.send(adDetail);
    })
});

exports.allAssignedProduct = ((req, res, next) => {

    RentedProducts.aggregate([
        {
            $match: {
                deliveryStatus: "Pending",
                status: "Assigned"
            }
        },
        
    ], (error, response) => {
        if (error) return next(error)
        res.send(response)
    })
});

exports.allDeliveredProduct = ((req, res, next) => {

    RentedProducts.aggregate([
        {
            $match: {
                deliveryStatus: "Delivered",
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "riderId",
                foreignField: "_id",
                as: "RiderDetails"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "UserDetails"
            }
        },
        {
            $lookup: {
                from: "addresses",
                localField: "address",
                foreignField: "_id",
                as: "UserAddress"
            }
        }
    ], (error, response) => {
        if (error) return next(error)
        res.send(response)
    })
});


exports.assignedProductToRider = ((req, res, next) => {

    RentedProducts.findByIdAndUpdate(req.params.id,
        {
            $set: {
                riderId: req.body.riderId,
                status: "Assigned"
            }
        },
        (err, assignedProductDetails) => {
            if (err) return next(err);

            res.send(assignedProductDetails);
        });
});

exports.deliveredProducts = ((req, res, next) => {

    RentedProducts.aggregate([
        {
            $match: {
                deliveryStatus: "Delivered"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "riderId",
                foreignField: "_id",
                as: "RiderDetails"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "UserDetails"
            }
        }
    ], (error, response) => {
        if (error) return next(error)
        res.send(response)
    })
});

exports.pickedupProducts = ((req, res, next) => {

    RentedProducts.aggregate([
        {
            $match: {
                deliveryStatus: "Pickedup"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "riderId",
                foreignField: "_id",
                as: "RiderDetails"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "UserDetails"
            }
        },
        {
            $lookup: {
                from: "addresses",
                localField: "address",
                foreignField: "_id",
                as: "shipmentAddress"
            }
        }
    ], (error, response) => {
        if (error) return next(error)
        res.send(response)
    })
});

exports.adDetail = ((req, res, next) => {
    PostAd.findById(req.params.id).populate("userId").populate("address").exec((err, adDetail) => {
        if (err) return next(err);
        res.send(adDetail);
    })
});

exports.changeAdStatus = ((req, res, next) => {

    PostAd.findByIdAndUpdate(req.params.id,
        {
            $set: {
                status: 'Approved'
            }
        },
        (err, adDetails) => {
            if (err) return next(err);

            res.send(adDetails);
        });
});

exports.changeAdStatusToReturned = ((req, res, next) => {

    RentedProducts.findByIdAndUpdate(req.params.id,
        {
            $set: {
                deliveryStatus: 'Returned'
            }
        },
        (err, adDetails) => {
            if (err) return next(err);

            res.send(adDetails);
        });
});


exports.declineAd = ((req, res, next) => {

    PostAd.findByIdAndUpdate(req.params.id,
        {
            $set: {
                status: 'Declined'
            }
        },
        (err, adDetails) => {
            if (err) return next(err);

            res.send(adDetails);
        });
});

exports.allUsers = ((req, res, next) => {

    User.aggregate([
        {
            $match: {
                userType: "user",
            }
        },
        {
            $lookup: {
                from: "addresses",
                localField: "address",
                foreignField: "_id",
                as: "UserAddress"
            }
        }
    ], (error, response) => {
        if (error) return next(error)
        res.send(response)
    })
});

exports.allRiders = ((req, res, next) => {

    User.aggregate([
        {
            $match: {
                userType: "rider",
            }
        },
        {
            $lookup: {
                from: "addresses",
                localField: "address",
                foreignField: "_id",
                as: "UserAddress"
            }
        }
    ], (error, response) => {
        if (error) return next(error)
        res.send(response)
    })
});


exports.userDetails = ((req, res, next) => {
    User.findById(req.params.id).populate("address").exec((err, userDetails) => {
        if (err) return next(err);
        res.send(userDetails);
    })
});

exports.deleteUser= ((req, res, next) => {
    User.findByIdAndRemove(req.params.id).populate("address").exec((err, deleteUser) => {
        if (err) return next(err);
        res.send(deleteUser);
    })
});



// exports.usersDetails = ((req, res, next) => {
//     User.findById(req.decoded.id).populate("address").exec((err, userDetails) => {
//         if (err) return next(err);
//         res.send(userDetails);
//     })
// });