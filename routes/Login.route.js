const express = require('express');
const router = express.Router();

const login_controller = require('../controllers/Login.Controller');

router.post('/login', login_controller.userLogin);

module.exports = router;