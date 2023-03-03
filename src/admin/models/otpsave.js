const mongoose = require('mongoose');
//OTPVERIFY SCHEMA
const VerifyOtpSchema = mongoose.Schema({
    mobile_number: {
        type:Number,
        required:true
    },
    otp: {
        type: String,
        required :true

    },

    createdAt: {type: Date, default: Date.now, index: {expires: 300000} }
    
})

   

module.exports =  mongoose.model('Otpsave', VerifyOtpSchema)


