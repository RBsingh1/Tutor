require('dotenv').config(); //get env variables

const express   = require('express'); 
const Class      = require('../models/class'); 
const mongoose  = require('mongoose'); 
const jwt       = require('jsonwebtoken');
const checkToken= require('../middleware/check-token'); 
const router    = express.Router(); 

// **** All List **** //
router.get('/allClass',checkToken, async (req, res) => {
    try{
        const data = await Class.find(); 
        return res.status(200).json({
            status:200,
            msg:'All Class List',
            data: data
        })
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})


module.exports = router;