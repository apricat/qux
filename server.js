var config = require('./config');
var express = require('express');
var app = express();                        // create our app w/ express
var mongoose = require('mongoose');
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

router.route('/questions/:question_id')
  .get(questionController.getQuestion)
  .delete(questionController.deleteQuestion);

router.route('/users')
  .post(userController.postUsers)
  .get(userController.getUsers);

router.route('/users/:user_id')
  .get(userController.getUser)
  .put(userController.putUser)
  .delete(userController.deleteUser);

router.route('/users/:user_id/score/increment')
  .put(userController.putUserScore);

router.route('/users/:user_id/questions')
  .get(userController.getUserQuestions);

app.use('/api', router);

// application -------------------------------------------------------------
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(8080);
console.log("App listening on port 8080");

var notificationApp = require('./operations/notifications');
notificationApp.execute();
