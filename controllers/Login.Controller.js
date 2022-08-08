const User = require('../models/User.model');
const config = require('../Config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.userLogin = ((req, res, next) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) return next(err);
        if (!user) return res.status(404).send("User not found");

        var passwordValidity = bcrypt.compareSync(req.body.password, user.password);

        if (!passwordValidity) return res.status(401).send({ auth: false, token: null })

        var token = jwt.sign({ id: user._id }, config.secret);

        res.status(200).send({ auth: true, token: token });

    });
});