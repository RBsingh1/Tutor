const mongoose = require("mongoose")
const quizSchema = mongoose.Schema({
   set:{
    type:mongoose.Types.ObjectId,
    required:true
   },
   question:{
    type:String,
    required:true
   },
   options:{
    type:Array,
    required:true
   },
   createdAt:{
      type:Date,
      default:Date.now()
  }
})
module.exports = mongoose.model("Quiz", quizSchema)