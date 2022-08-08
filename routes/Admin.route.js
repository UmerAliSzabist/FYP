const express = require('express');
const router = express.Router();

const Admin_Controller = require('../controllers/Admin.Controller');

router.post('/addRider', Admin_Controller.addRider);

router.get('/ads', Admin_Controller.ads);

router.get('/deliveredProducts', Admin_Controller.deliveredProducts);

router.get('/pickedupProducts', Admin_Controller.pickedupProducts);

router.get('/adDetails/:id', Admin_Controller.adDetail);

router.post('/changeAdStatus/:id', Admin_Controller.changeAdStatus);

router.post('/changeAdStatusToReturned/:id', Admin_Controller.changeAdStatusToReturned);

router.post('/declineAd/:id', Admin_Controller.declineAd);

router.get('/rentedProducts', Admin_Controller.RentedProducts);

router.get('/allAssignedProducts', Admin_Controller.allAssignedProduct);

router.get('/allDeliveredProducts', Admin_Controller.allDeliveredProduct);

router.get('/rentedProductDetails/:id', Admin_Controller.RentedProductDetails);

router.post('/assignProductToRider/:id', Admin_Controller.assignedProductToRider);

router.get('/allUsers', Admin_Controller.allUsers);

router.get('/allRiders', Admin_Controller.allRiders);

router.get('/userDetails/:id', Admin_Controller.userDetails);

router.post('/deleteUser/:id', Admin_Controller.deleteUser);

module.exports = router;