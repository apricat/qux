// Load required packages
var Question = require('../dao/question');

// POST /api/questions
exports.postQuestions = function(req, res) {
  var question = new Question();

  //question.userId = req.user._id;
  question._userId = req.body._userId; // @TODO replace with oauth
  question.content = req.body.content;
  question.answers = req.body.answers;
  question.correctAnswer = req.body.correctAnswer;

  question.save(function(err) {
    if (err)
      return res.send(err);

    res.json({ message: 'Question added!', data: question });
  });
};

// GET /api/questions
exports.getQuestions = function(req, res) {
  Question.find(function(err, questions) {
    if (err)
      return res.send(err);

    res.json(questions);
  });
};

// GET /api/questions/:question_id
exports.getQuestion = function(req, res) {
  Question.findById({ _id: req.params.question_id }, function(err, question) {
    if (err)
      return res.send(err);

    res.json(question);
  });
};

// DELETE /api/questions/:question_id
exports.deleteQuestion = function(req, res) {
  Question.findByIdAndRemove({ _id: req.params.question_id }, function(err) {
    if (err)
      return res.send(err);

    res.json({ message: 'Question removed!' });
  });
};
