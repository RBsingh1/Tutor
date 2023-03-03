const mongoose = require("mongoose")
const resultSchema = mongoose.Schema({
    result_id:{
        type:String,
        required:true
    },
    student_id:{
        type:String,
        required:true
    },
    qset:{              //Question set objectid
        type:String,
        required:true
    },
    class_id:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    ques_no:{
        type:Number,
        required:true
    },
    answer:{
        type:String,
        required:true
    },
    correct_ans:{
        type:String,
        required:false
    },
    status:{
        type:String,
        required:false
    }
})
module.exports = mongoose.model("Resultlog",resultSchema)