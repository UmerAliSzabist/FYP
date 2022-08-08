const User = require('../models/User.model');
const Address = require('../models/Address.model');
const PostAd = require('../models/PostAd.model');
const bcrypt = require('bcryptjs');
const RentedProducts = require('../models/RentedProducts');
const PaymentDetails = require('../models/PaymentDetails');
const generateUniqueId = require('generate-unique-id');

const mongoose = require('mongoose');

var nodemailer = require('nodemailer');


exports.addUser = async (req, res, next) => {

    const userExist = await User.findOne({ email: req.body.email });

    const id = new mongoose.Types.ObjectId();

    if (userExist) {
        return res.status(422).send("User Already Exist")
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
            mobileNumber: req.body.mobileNumber,
            address: address._id,
            password: req.body.password,
            cPassword: req.body.cPassword,
        });

        user.save((err) => {
            if (err) return next(err);
            res.status(201).send("User created successfully");
        });

    });

};

exports.postAd = ((req, res, next) => {

    let address = new Address({
        houseNo: req.body.houseNo,
        streetNo: req.body.streetNo,
        nearBy: req.body.nearBy
    });

    address.save((err, address) => {
        if (err) return next(err);
        let postAd = new PostAd({
            userId: req.decoded.id,
            title: req.body.title,
            image: req.body.image,
            category: req.body.category,
            mobileNumber: req.body.mobileNumber,
            price: req.body.price,
            address: address._id,
            description: req.body.description,
        });

        postAd.save((err) => {
            if (err) return next(err);
            res.status(201).send("PostAd Request Added");
        });
    });
});

exports.cameraAds = ((req, res, next) => {

    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)

    const startIndex = (page - 1) * limit
    // const endIndex = page * limit

    PostAd.aggregate([
        {
            $match: {
                status: "Approved",
                category: "Camera"
            }
        },
        {
            $skip: startIndex
        },
        {
            $limit: limit
        }
    ], (error, response) => {
        if (error) return next(error)
        res.send(response)
    })

    // const adResults = {}

    // if (endIndex < ads.length) {
    //     adResults.next = {
    //         page: page + 1,
    //         limit: limit
    //     }
    // }

    // if (startIndex > 0) {
    //     adResults.previous = {
    //         page: page - 1,
    //         limit: limit
    //     }
    // }

    // adResults.adResults = ads.slice(startIndex, endIndex)
    // res.json(adResults)
})

exports.computerAds = ((req, res, next) => {

    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)

    const startIndex = (page - 1) * limit
    // const endIndex = page * limit

    PostAd.aggregate([
        {
            $match: {
                status: "Approved",
                category: "Computer"
            }
        },
        {
            $skip: startIndex
        },
        {
            $limit: limit
        }
    ], (error, response) => {
        if (error) return next(error)
        res.send(response)
    })
})

exports.adDetail = ((req, res, next) => {
    PostAd.findById(req.params.id).populate("userId").populate("address").exec((err, adDetail) => {
        if (err) return next(err);
        res.send(adDetail);
    })
});

exports.myAds = ((req, res, next) => {
    PostAd.find({ userId: req.decoded.id }, (err, response) => {
        if (err) return next(err)
        res.send(response);
    })
});

exports.myRentedProducts = ((req, res, next) => {
    RentedProducts.find(({ userId: req.decoded.id }), (err, response) => {
        if (err) return next(err)
        res.send(response);
    })
});

exports.deleteMyAd = ((req, res, next) => {
    PostAd.findByIdAndRemove((req.params.id), (err, response) => {
        if (err) return next(err);
        res.send(response);
    })
});

exports.sellerDetails = ((req, res, next) => {
    User.findById(req.params.id).populate("address").exec((err, sellerDetails) => {
        if (err) return next(err);
        res.send(sellerDetails);
    })
    // User.findById(req.params.id, (err, sellerDetails) => {
    //     if (err) return next(err);

    //     res.send(sellerDetails);
    // });
});

exports.rentProduct = ((req, res, next) => {

    const trackingId = generateUniqueId({
        length: 5,
        useLetters: false
    });

    let address = new Address({
        houseNo: req.body.houseNo,
        streetNo: req.body.streetNo,
        nearBy: req.body.nearBy
    });

    address.save((err, address) => {
        if (err) return next(err);
        let rentedProduct = new RentedProducts({
            userId: req.decoded.id,
            trackingId: trackingId,
            productId: req.body.productId,
            title: req.body.title,
            category: req.body.category,
            name: req.body.name,
            mobileNumber: req.body.mobileNumber,
            city: req.body.city,
            address: address._id,
            numberOfDays: req.body.numberOfDays,
            price: req.body.price,
            image: req.body.image,
            returnDate: req.body.returnDate
        });

        rentedProduct.save((err) => {
            if (err) return next(err);
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'cs1812120@szabist.pk',
                    pass: 'google789'
                }
            });
        
            var mailOptions = {
                from: 'cs1812120@szabist.pk',
                to: req.body.to,
                subject: 'Product Rented From RentBucket',
                text: `Dear Custumer, \nYou have Successfully Rented out Product and your traking id is ${trackingId}`
            };
        
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                    res.send(info.response)
                }
            });
        });
    });
});

exports.changeProductStatus = ((req, res, next) => {

    PostAd.findByIdAndUpdate(req.params.id,
        {
            $set: {
                status: 'Rented'
            }
        },
        (err, userDetails) => {
            if (err) return next(err);

            res.send(userDetails);
        });
});

exports.paymentDetails = ((req, res, next) => {

    let paymentedDetails = new PaymentDetails({
        userId: req.decoded.id,
        cardNumber: req.body.cardNumber,
        nameOfCard: req.body.nameOfCard,
        expiration: req.body.expiration,
        cvvNumber: req.body.cvvNumber,
        securityDeposite: req.body.securityDeposite
    });

    paymentedDetails.save((err) => {
        if (err) return next(err);
    });

    res.send("Payment Received");
});

exports.findPaymentDetials = ((req, res, next) => {
    PaymentDetails.find({ userId: req.decoded.id }, (err, response) => {
        if (err) return next(err)
        res.send(response);
    })
});

exports.pickeupProducts = ((req, res, next) => {
    RentedProducts.find({ riderId: req.decoded.id, deliveryStatus: "Delivered" }, (err, response) => {
        if (err) return next(err)
        res.send(response);
    })
});

exports.updateAccount = ((req, res, next) => {

    PaymentDetails.findByIdAndUpdate(req.params.id,
        {
            $inc: {
                securityDeposite: + req.body.securityDeposite
            }
        },
        (err, response) => {
            if (err) return next(err);

            res.send(response);
        });
});

exports.sendMail = ((req, res, next) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'cs1812120@szabist.pk',
            pass: 'google789'
        }
    });

    var mailOptions = {
        from: 'cs1812120@szabist.pk',
        to: req.body.to,
        subject: 'Product Rented From RentBucket',
        text: 'Dear Custumer, \nYou have Successfully Rented out Product'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            res.send(info.response)
        }
    });

});

exports.searchProduct = (async (req, res, next) => {

    PostAd.aggregate([
        {
            $match:
            {
                status: "Pending",
                '$or': [
                    { 'title': { $regex: req.params.key } },
                ]
            }
        }
    ], (error, response) => {
        if (error) return next(error)
        res.send(response)
    })

})

exports.usersDetails = ((req, res, next) => {
    // User.findById(req.decoded.id, (err, userDetails) => {
    //     if (err) return next(err);

    //     res.send(userDetails);

    // });
    User.findById(req.decoded.id).populate("address").exec((err, userDetails) => {
        if (err) return next(err);
        res.send(userDetails);
    })
});

exports.usersDetailsById = ((req, res, next) => {
    User.findById(req.params.id).populate("address").exec((err, userDetailsById) => {
        if (err) return next(err);
        res.send(userDetailsById);
    })
});

//Riders API's

exports.ridersOrdersTab = ((req, res, next) => {
    RentedProducts.find({ riderId: req.decoded.id, deliveryStatus: "Pending" }, (err, response) => {
        if (err) return next(err)
        res.send(response);
    })
})

exports.markAsDelivered = ((req, res, next) => {

    RentedProducts.findByIdAndUpdate(
        (
            req.params.id
        ),
        {
            $set: {
                deliveryStatus: 'Delivered'
            },
        },
        (err, userDetails) => {
            if (err) return next(err);

            res.send(userDetails);
        });
})

exports.markAsPicked = ((req, res, next) => {

    RentedProducts.findByIdAndUpdate(
        (
            req.params.id
        ),
        {
            $set: {
                deliveryStatus: 'Picked'
            },
        },
        (err, userDetails) => {
            if (err) return next(err);

            res.send(userDetails);
        });
})

exports.deliveredOrder = ((req, res, next) => {

    RentedProducts.find({ riderId: req.decoded.id, deliveryStatus: "Delivered" }, (err, response) => {
        if (err) return next(err)
        res.send(response);
    })
})

exports.rentedProductDetail = ((req, res, next) => {
    RentedProducts.findById(req.params.id).populate("address").populate("userId").exec((err, rentedProductDetail) => {
        if (err) return next(err);
        res.send(rentedProductDetail);
    })
});

