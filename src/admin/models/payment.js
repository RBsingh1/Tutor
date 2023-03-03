const mongoose =require("mongoose")
const paymentSchema = mongoose.Schema({  
    student_id:{ type:String, required:false },
    student_name:{ type:String, required:true },
    student_contact:{ type:Number, required:false },
    received_fee:{ type:Number, required:false },
    payment_type:{ type:String, required:true },
    payment_mode:{ type:String, required:true },
    payment_history:{ type:String, required:false },
    addedat:{ type:Date, required:false },
    action:{ type:String, required:false } 
})

module.exports = mongoose.model("payment",paymentSchema)