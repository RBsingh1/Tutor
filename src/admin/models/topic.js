const mongoose = require('mongoose');
const topicSchema = mongoose.Schema({
   chapter_id: {
      type: mongoose.Types.ObjectId,
      required: true
   },
   subject_id: {
      type: mongoose.Types.ObjectId,
      required: true
   },
   topic_name: {
      type: String,
      required: false
   },
   upload_video: {
      type: String,
      required: false
   },
   upload_pdf: {
      type: String,
      required: true
   },
   status: {
      type: String,
      required: true
   },
   date: {
      type: Date,
      default: Date.now()
   }
});

module.exports = mongoose.model('topic', topicSchema);