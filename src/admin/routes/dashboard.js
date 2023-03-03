const express = require("express")
const student = require("../models/student")
const Chapter= require('../models/chapter');
const Topic = require('../models/topic');
const checkToken = require('../middleware/check-token');
const router = express.Router();

//Count Student Collection Documents by class
router.post('/student',checkToken, async (req, res) => {
    const admin_id = req.body.admin_id
    try {
        const result = await student.find({admin_id}).count()
        return res.status(200).json({
            success : true,
            status: 200,
            msg: 'class List',
            data: result
        })
    }
    catch (error) {
        res.status(500).json({success:false, message: error.message })
    }
});


//Count Total Students in Student Collection
router.get('/student/count',checkToken, async (req, res) => {
    try {
        const result = await student.count()
        return res.status(200).json({
            success:true,
            status: 200,
            msg: 'Total Students',
            data:result
        })
    }
    catch (error) {
        res.status(500).json({success:false, message: error.message })
    }
});


//Count Total Chapters in Chapters Collection
router.get('/chapter/count',checkToken, async (req, res) => {
    try {
        const result = await Chapter.count()
        return res.status(200).json({
            success:true,
            status: 200,
            msg: 'Total Chapters',
            data:result
        })
    }
    catch (error) {
        res.status(500).json({success:false, message: error.message })
    }
});


//Count Total topics in Topics Collection
router.get('/topic/count',checkToken, async (req, res) => {
    try {
        const result = await Topic.count()
        return res.status(200).json({
            success:true,
            status: 200,
            msg: 'Total Topics',
            data:result
        })
    }
    catch (error) {
        res.status(500).json({success:false, message: error.message })
    }
});



module.exports = router

