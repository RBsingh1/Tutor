const express = require("express")
const mongoose = require("mongoose")
const Payment = require("../models/payment")
const PaymentLog = require("../models/paymentLog")
const router = express.Router()
const checkToken = require('../middleware/check-token'); 
const { result } = require("lodash")


// ** Add Payment ** //
router.post('/payment/paybystudent', checkToken, async (req, res) => {
    try {
        const data = new Payment({
            _id:new mongoose.Types.ObjectId(),
            student_id: req.body.student_id, //student object id
            student_name: req.body.student_name,
            student_contact: req.body.student_contact,
            received_fee: req.body.received_fee,
            payment_type: req.body.payment_type,
            payment_mode: req.body.payment_mode,
            payment_history: req.body.payment_history,
            action: 'payment received',
            addedat: new Date()
        })
        
        const de = await data.save()
            .then(result => {
                if(result){
                    const logdata = new PaymentLog({
                        _id:new mongoose.Types.ObjectId(),
                        payment_id: result._id,
                        student_name: result.student_name,
                        payment_type: result.payment_type,
                        payment_mode: result.payment_mode,
                        fee_amount: result.received_fee,
                        status: 'payment received'
                    })
                    const logs = logdata.save();
                    console.log(logdata, logs);
                    res.status(200).json({ success: true, message: 'data stored!', res: result, logs : logs });
                }
            })
            .catch(err => {
                res.status(500).json({ success: false, error: err });
            })
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
});


//payment list
router.get("/payment/list",checkToken, async (req, res) => {
    try {
        const payment = await Payment.find();
        if(payment.length > 0){
            return res.status(200).json({ success: true,count:payment.length ,data: payment })
        }else{
            return res.status(200).json({ success: false, msg: 'No data found' })
        }

    } catch (err) {
        return res.status(401).json({ success: false, msg: err.message })
    }
})

//get payment by id
router.get('/payment/getone/:paymentId',checkToken,(req, res, next)=>{
    const id = req.params.paymentId;
    // ******************//
    try{
    const result = Payment.aggregate([
        {   $match: {
                // title: { $regex: /example/ }
                _id: id
            } 
        },
        {
            $lookup:
            {
                from: "paymentLogs",
                localField: "_id",
                foreignField: "payment_id",
                as: "alldata"
            }
        },{ $project:{ "alldata.student_name": 1, "alldata.received_fee": 1, "alldata.payment_history": 1 } }
    ]);
    if(result){
        res.status(200).json({ success: true, msg:'payment data and logs!' , data: result });
    }else{
        res.status(404).json({ message : 'No valid entry found for this id' });
    }
    
    //*******************//
    // Payment.findById(id)
    // .exec()
    // .then( result => {
    //     if(result){
    //         res.status(200).json({ success: true, msg:'one payment data!' , data: result });
    //     }else{
    //         res.status(404).json({ message : 'No valid entry found for this id' });
    //     }
    // })
    // .catch(err => {
    //     console.log(err);
    //     res.status(500).json({error:err});
    // });
    } catch (err) {
        return res.status(401).json({ success: false, msg: err.message })
    }
});


// //payment list get by id
// router.post("/payment/transaction",checkToken, async (req, res) => {
//     const id = req.body._id
//     try {
//         const payment = await Payment.findById({ _id: id })
//         return res.status(200).json({ success: true, data: payment })
//     } catch (err) {
//         return res.status(401).json({ success: false, msg: err.message })
//     }
// })

//paymentlog list get by id
// router.post("/paymentlog/transaction", async (req, res) => {
//     const id =new mongoose.Types.ObjectId(req.body._id)
//     console.log(id)
//     try {
//         const Paymentlog = await PaymentLog.findById({_id:id})
//         return res.status(200).json({ success: true, data: Paymentlog })
//     } catch (err) {
//         return res.status(401).json({ success: false, msg: err.message })
//     }
// })



//Delete a payment entry from the collection 
router.delete('/payment/delete/:_id',checkToken, (req, res, next)=>{
    const id = req.params._id;
    Payment.deleteOne({ _id : id })
    .exec()
    .then( result => {
        // console.log(result)
        if(result){
            res.status(200).json({success:true, msg:'Data removed'});
        }else{
            res.status(402).json({success:false, msg:'Wrong ID'});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({success:false, error:err});
    });
});




//paymentlog list 
router.get("/paymentlog/list", checkToken, async (req, res) => {
    try {
        const Paymentlog = await PaymentLog.find()
        // return res.status(200).json({ success: true, data: Paymentlog })
        if(Paymentlog.length > 0){
            return res.status(200).json({ success: true, count: Paymentlog.length, msg:'one paymentlog data!' , data: Paymentlog });
        }else{
            return res.status(404).json({ success:false, msg : 'No data found!' });
        }
    } catch (err) {
        return res.status(401).json({ success: false, msg: err.message })
    }
})


//Delete a payment log from the collection 
router.delete('/paymentlog/delete/:_id',checkToken, (req, res, next)=>{
    const id = req.params._id;
    PaymentLog.deleteOne({ _id : id })
    .exec()
    .then( result => {
        // console.log(result)
        if(result){
            res.status(200).json({success:true, msg:'Data removed'});
        }else{
            res.status(402).json({success:false, msg:'Wrong ID'});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({success:false, error:err});
    });
});

module.exports = router