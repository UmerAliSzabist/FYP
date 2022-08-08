const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/User.controller');
const { loginValidation } = require("../middleware/LoginValidation");

router.post('/createUser',user_controller.addUser);

router.post('/postAdRequest', loginValidation ,user_controller.postAd);

router.get('/cameraAds', user_controller.cameraAds);

router.get('/computerAds', user_controller.computerAds);

router.get('/adDetails/:id', user_controller.adDetail);

router.get('/sellerDetails/:id', user_controller.sellerDetails);

router.post('/rentProduct', loginValidation , user_controller.rentProduct);

router.post('/changeProductStatus/:id', user_controller.changeProductStatus);

router.post('/sendEmail', user_controller.sendMail);

router.get('/searchProduct/:key', user_controller.searchProduct);

router.get('/userDetails', loginValidation , user_controller.usersDetails);

router.get('/userDetailsById/:id', user_controller.usersDetailsById);

router.get('/myAds', loginValidation , user_controller.myAds);

router.post('/deleteMyAd/:id',  user_controller.deleteMyAd);

router.get('/myRentedProducts', loginValidation , user_controller.myRentedProducts);

//Rider API's

router.get('/riderOrders',loginValidation, user_controller.ridersOrdersTab);

router.post('/markasdelivered/:id', user_controller.markAsDelivered);

router.post('/markasPicked/:id', user_controller.markAsPicked);

router.get('/deliveredOrders', loginValidation, user_controller.deliveredOrder);

router.get('/pickupProduct', loginValidation,user_controller.pickeupProducts);

router.get('/rentedProductDetail/:id', user_controller.rentedProductDetail);

// Payment Details 

router.post('/paymentDetails', loginValidation , user_controller.paymentDetails);

router.post('/upgradeAccount/:id', loginValidation , user_controller.updateAccount);

router.get('/findPaymentDetials', loginValidation , user_controller.findPaymentDetials);

module.exports = router;