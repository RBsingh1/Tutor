const mongoose = require('mongoose');
const chapterSchema = mongoose.Schema({
    class_id: { type: mongoose.Types.ObjectId, required: true },
    subject_id: { type: mongoose.Types.ObjectId, required: true },
    board: { type: String, required: true },
    language: { type: String, required: true },
    chapter_title: { type: String, required: true },
    description: { type: String, required: false },
    status: { type: String, required: true },
    date: { type: Date, default: Date.now() },

});
module.exports = mongoose.model('chapters', chapterSchema);


