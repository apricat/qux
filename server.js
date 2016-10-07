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

var Question = mongoose.model('Question', {
    text : String,
    answers : {
      correct: Number,
      choices: [String]
    }
});

app.listen(8080);
console.log("App listening on port 8080");

// routes ======================================================================

    // api ---------------------------------------------------------------------
    app.get('/api/questions', function(req, res) {
        Question.find(function(err, questions) {
            if (err)
                res.send(err)

            res.json(questions);
        });
    });

    app.post('/api/questions', function(req, res) {
        Question.create({
            text : req.body.text,
            answers : {
              correct : req.body.answers.correct,
              choices : req.body.answers.choices
            },
            done : false
        }, function(err, question) {
            if (err)
                res.send(err);

            Question.find(function(err, questions) {
                if (err)
                    res.send(err)
                res.json(questions);
            });
        });

    });

    app.delete('/api/questions/:question_id', function(req, res) {
        Question.remove({
            _id : req.params.question_id
        }, function(err, question) {
            if (err)
                res.send(err);

            Question.find(function(err, questions) {
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