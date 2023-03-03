const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
const Notification = require("../models/notify")
const NotificationLog = require("../models/notify-log")
const checkToken = require('../middleware/check-token');
const Student = require("../models/student")

//Create notification
router.post('/notification/add',checkToken, async (req, res) => {
     const class_id = req.body.class_id
    try {
         const studentList =await Student.find({class_id, status:'active'}).select('_id');

         const data = new Notification({
             notification_title: req.body.notification_title,
             notification_description: req.body.notification_description,
             class_id: req.body.class_id,
             sent_on: req.body.sent_on,
             status: req.body.status,
             addedat: new Date()
            })
            data.save().then(result => {
                for (const [_, value] of Object.entries(studentList)) {
                    const dataLog = new NotificationLog({
                        notify_id : result._id,
                        student_id   : value._id
                    });
                    dataLog.save();
                    if(dataLog){
                    var noti =Student.findOneAndUpdate({_id:value._id},{$inc:{notification_count:1}},
                        function(err,res){
                            console.log(err)
                        });
                    }
                    
                }
      
              return res.status(200).json({
                    success: true,
                    message: 'data stored!'
                });
            })
            .catch(err => {
                res.status(500).json({
                    success: false,
                    error: err
                });
            })
    }//}
    catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
});

//Read the notification
router.get("/notification/list",checkToken, async(req,res)=>{
    try{
        const data = await Notification.find()
        return res.status(200).json({success:true, data:data})
    }catch(err){
        return res.status(401).json({success:false, msg:err.message})
    }
})

//Notification Edit
router.patch('/notification/update/:_id',checkToken, (req, res, next) => {

    Notification.findByIdAndUpdate(req.params._id, req.body, (err, emp) => {
        if (err) {
            return res.status(500).send({ success: false, error: "Problem with Updating the recored " })
        };
        res.send({ success: true, msg: "Update successfull" });
    })
});

//Delete notifications
router.delete('/notification/delete/:_id',checkToken, (req, res, next) => {
    const id = req.params._id;
    Notification.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({ success: true, msg: result });
        })
        .catch(err => {
            res.status(500).json({ success: false, error: err });
        });
});

module.exports = router