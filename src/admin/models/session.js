const mongoose = require("mongoose")
const sessionSchema = mongoose.Schema({
    session:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model("Session", sessionSchema)