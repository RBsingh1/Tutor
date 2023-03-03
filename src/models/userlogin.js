const mongoose = require('mongoose')

//LOGIN
const TutorSchema = mongoose.Schema({
  student_name: {
    type: String,
    required: true
  }, student_email: {
    type: String,
    required: true
  }, father_name: {
    type: String,
    required: true
  }, roll_on: {
    type: String,
    required: true
  }, date_of_admission: {
    type: String,
    required: true
  }, contact_no: {
    type: String,
    required: true
  },
  student_photo: {
    type: String,
    required: true
  },
  id: {
    type: Object
  }
})

module.exports = mongoose.model('tutor', TutorSchema)