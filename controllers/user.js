// Load required packages
var User = require('../models/user');
var Question = require('../models/question');

// POST /api/users
exports.postUsers = function(req, res) {
  var user = new User({
    username: req.body.username,
    password: req.body.password
  });

  user.save(function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'New user created!', data: user });
  });
};

// GET /api/users
exports.getUsers = function(req, res) {
  User.find(function(err, users) {
    if (err)
      res.send(err);

    res.json(users);
  });
};

// GET /api/user/:user_id
exports.getUser = function(req, res) {
  User.findByIdAndRemove(req.params.user_id, function(err, user) {
    if (err)
      return res.send(err);

      res.json(user);
  });
};

// DELETE /api/user/:user_id
exports.deleteUser = function(req, res) {
  User.findByIdAndRemove(req.params.user_id, function(err) {
    if (err)
      return res.send(err);

    res.json({ message: 'User removed!' });
  });
};

// GET /api/user/:user_id/questions
exports.getUserQuestions = function(req, res) {
  Question.find({ _userId: req.params.user_id }, function(err, questions) {
    if (err)
      return res.send(err);

    res.json(questions);
  });
};