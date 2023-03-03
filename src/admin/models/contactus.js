const mongoose = require("mongoose")
const contactSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    contact_no:{
        type:Number,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    time:{
        type:Date,
        default:Date.now()
    },
    action:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model("Contactus", contactSchema)