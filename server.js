var config = require('./config');
var express = require('express');
var app = express();                        // create our app w/ express
var mongoose = require('mongoose');
var morgan = require('morgan');                  // log requests to the console (express4)
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var http = require('http');

mongoose.connect(config.mongodb);

app.use(express.static(__dirname + '/public'));                 // static files location
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/scripts', express.static(__dirname + '/node_modules'));

// routes ======================================================================
var userController = require('./controllers/user');
var questionController = require('./controllers/question');

var router = express.Router();
app.use(bodyParser.urlencoded({
  extended: true
}));

router.route('/questions')
  .post(questionController.postQuestions)
  .get(questionController.getQuestions);

router.route('/question/:question_id')
  .get(questionController.getQuestion)
  .delete(questionController.deleteQuestion);

router.route('/users')
  .post(userController.postUsers)
  .get(userController.getUsers);

router.route('/user/:user_id')
  .get(userController.getUser)
  .delete(userController.deleteUser);

router.route('/user/:user_id/questions')
  .get(userController.getUserQuestions);

app.use('/api', router);

// application -------------------------------------------------------------
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/quizz', function(req, res) {
    res.sendFile(__dirname + '/public/quizz.html');
});

app.listen(8080);
console.log("App listening on port 8080");

// jobs --------------------------------------------------------------------
var CronJob = require('cron').CronJob;
new CronJob('* * * * *', function() {
  console.log('Attempting push...');

  // foreach user
  // - retrieve endpoint
  // - build registration_ids array
  // - 1 http request with registrations_ids

  var request = require('request');
  var req = '{"registration_ids":["'+config.tempEntrypoint+'"]}';
  var options = {
    url: 'https://android.googleapis.com/gcm/send/',
    headers: {
      'Content-Type' : 'application/json',
      'Authorization' : config.pushAuthKey
    },
    body: req,
    json: true
  };

  request.post(options, function (error, response, body) {
    console.log(error);
      if (!error && response.statusCode == 200) {
          console.log(body)
      }
  });

}, null, true, 'America/Los_Angeles');
