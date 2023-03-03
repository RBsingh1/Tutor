const mongoose = require('mongoose');
//OTPVERIFY SCHEMA
const VerifyOtpSchema = mongoose.Schema({
    contact_no: {
        type:String,
        required:true
    },
    otp: {
        type: String,
        required :true

    },

    createdAt: {type: Date, default: Date.now, index: {expires: 300000} }
    
})

   

module.exports =  mongoose.model('otpsave', VerifyOtpSchema)


