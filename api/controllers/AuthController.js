'use strict';

const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

// Load input validation
const validateRegisterInput = require("../../helpers/validation/register");
const validateLoginInput = require("../../helpers/validation/login");

exports.register = function(req, res, instamobileDB) {
    // Form validation
    const { errors, isValid } = validateRegisterInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    instamobileDB.register(req.body, user => {
        res.json({...user})
    })

}

exports.login = function(req, res, instamobileDB) {
    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;

    instamobileDB.loginWithEmailAndPassword(email, password, (payload, err) => {
        if (err) {
            return res.status(400).json(err); 
        }
        // Sign token
        jwt.sign(
            payload,
            keys.secretOrKey,
            {
                expiresIn: 31556926 // 1 year in seconds
            },
            (err, token) => {
                res.json({
                    success: true,
                    token: "Bearer " + token
                });
            }
        );
    })
};
