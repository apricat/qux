var mongoose = require('mongoose');

var QuestionSchema   = new mongoose.Schema({
  _userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  content: String,
  answers: [String],
  correctAnswer: Number
});

// Export the Mongoose model
module.exports = mongoose.model('Question', QuestionSchema);
