require('dotenv').config(); //get env variables
const {Validator} = require('node-input-validator')
const express = require('express');
const Admin = require('../models/admin');
const Banner = require('../models/banner');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkToken = require('../middleware/check-token');

// Admin Login & genrate jwt token
router.post('/login2', async (req, res) => {
    try {
        const details = await Admin.findOne({ email: req.body.email });
        // console.log(req.params.email);
        // res.json(details)
        if (details.length < 1) {
            return res.status(401).json({
                msg: 'user not exits'
            })
        }
        // bcrypt.compare(req.body.password,details[0].password,(err,result)=>{
        if (req.body.password != details.password) {
            return res.status(401).json({
                msg: 'Wrong password!!!'
            })
        }
        if (req.body.password === details.password) {

            const token = jwt.sign(
                {
                    'email': details.email,
                    'id': details.id,
                    'first_name': details.first_name,
                    'last_name': details.last_name
                },
                process.env.JWT_KEY,
                {
                    expiresIn: '24h'
                });

            return res.status(200).json({
                status: 200,
                msg: 'User Logged In!!!',
                data: {
                    'email': details.email,
                    'fname': details.first_name,
                    'lname': details.last_name,
                    'token': token,
                }
            })
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message, data: error })
    }
});

module.exports = router;