require('dotenv').config(); //get env variables
const mongoose = require('mongoose')


  //OTPGENERATE SCHEMA
  const GenerateOtpSchema = mongoose.Schema({
    contact_no:{
      type:String,
      required:true
    },
    tokens:[{
      token:{
        type:String,
        required:true
      }
    }]
})


module.exports = mongoose.model('otplog',GenerateOtpSchema)