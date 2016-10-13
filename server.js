var config = require('./config');
var express = require('express');
var app = express();                        // create our app w/ express
var mongoose = require('mongoose');              // mongoose for mongodb
var morgan = require('morgan');                  // log requests to the console (express4)
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

mongoose.connect(config.mongodb);

app.use(express.static(__dirname + '/public'));                 // static files location
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

var Questions = mongoose.model('Question', {
    text : String,
    answers : {
      correct: Number,
      choices: [String]
    }
});

var User = mongoose.model('User', {
    username : String,
    endpoints : [String],
    score : Number
});

app.listen(8080);
console.log("App listening on port 8080");

// routes ======================================================================

app.get('/api/user/:id', function(req, res) {
    User.findById(req.params.id, function(err, user) {
        if (err)
            res.send(err)

        res.json(user);
    });
});

  // create user
  app.post('/api/user', function(req, res) {
    User.create({
        username : req.body.username,
        endpoints : req.body.endpoints,
        score : req.body.score
    }, function(err, user) {
        if (err)
            res.send(err);

        res.json(user);
    });
  });

  // increment user score
  app.put('/api/user/:id/score/:score', function(req, res) {
    User.findById(req.params.id, function(err, user) {
      if (!user) {
        console.log('error');
        return;
      }

      if (!user.score)
        user.score = 0;

      user.score += req.params.score;

      user.save(function(err) {
        if (err)
          console.log('error')
        else
          console.log('success')
      });
    });
  });

  // increment user score
  app.put('/api/user/:id', function(req, res) {
    User.findById(req.params.id, function(err, user) {
      if (!user)
        return next(new Error('Could not find user'));

      user.username = req.body.username;
      user.endpoints = req.body.endpoints;
      user.score = req.body.score;

      user.save(function(err) {
        if (err)
          console.log('error')
        else
          console.log('success')
      });
    });
  });

    app.get('/api/questions', function(req, res) {
        Questions.find(function(err, questions) {
            if (err)
                res.send(err)

            res.json(questions);
        });
    });

    app.post('/api/questions', function(req, res) {
        Questions.create({
            text : req.body.text,
            answers : {
              correct : req.body.answers.correct,
              choices : req.body.answers.choices
            }
        }, function(err, question) {
            if (err)
                res.send(err);

            Questions.find(function(err, questions) {
                if (err)
                    res.send(err)
                res.json(questions);
            });
        });

    });

    app.delete('/api/questions/:question_id', function(req, res) {
        Questions.remove({
            _id : req.params.question_id
        }, function(err, question) {
            if (err)
                res.send(err);

            Questions.find(function(err, questions) {
                if (err)
                    res.send(err)
                res.json(questions);
            });
        });
    });

    // application -------------------------------------------------------------
    app.get('/', function(req, res) {
        res.sendFile(__dirname + '/public/index.html');
    });

    app.get('/quizz', function(req, res) {
        res.sendFile(__dirname + '/public/quizz.html');
    });
