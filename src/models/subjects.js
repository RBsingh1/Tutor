const mongoose = require('mongoose')

  //SUBJECT SCHEMA
  const SubjectSchema = mongoose.Schema({
    sub_id:{
      type: Number,
      unique:true
    },
    sub_status:{
      type: String,
      required: true
    },
    sub_date:{
      type: Date,
      required: true
    },
    department_name:{
      type: String,
      required: true
    },
    subject_name:{
      type: String,
      required: true
    },
    class_id:{
      type:Number,
      required:true
    }
    })
   module.exports = mongoose.model('Subjects', SubjectSchema)