const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')

/*app.get('/', (req, res) => {
  res.send('hello world')
})*/

app.get('/', function(req, res) {
	db.collection('questions').find().toArray(function(err, result) {
  		console.log(result)
  		res.render('index.ejs', {questions: result})
	})
})

app.post('/questions', function(req, res) {
  db.collection('questions').save(req.body, function(err, result) {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
})

const MongoClient = require('mongodb').MongoClient

var db

MongoClient.connect('{your db address}', function(err, database) {
  if (err) return console.log(err)
  db = database
  app.listen(3000, function() {
    console.log('listening on 3000')
  })
})

app.get('/', function(req, res) {
  var cursor = db.collection('questions').find()
})