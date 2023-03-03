const mongoose = require("mongoose")
 const checkboxSchema = mongoose.Schema({
    class :{
        type:String,
        required: true
    },
    interest :{
        type:Array,
        required: true
    }
    
 })
 module.exports = mongoose.model('checkbox', checkboxSchema)