const mongoose = require("mongoose")
const classSchema = mongoose.Schema({
    class_name:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model("clas",classSchema)