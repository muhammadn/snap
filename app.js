require('dotenv').config()
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app = express();
var jwt = require('jsonwebtoken');
var cors = require('cors');

// db configuration
var db = require('./config/database');
const knex = require('./config/connection');

// configuration
var config = require('./config/application');

// set the port
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens

// controller
var user = require('./app/controllers/users_controller');
var auth = require('./app/controllers/auth_controller');

// enable CORS
app.use(cors());

// initialize auth
app.use(auth.initialize());

// helper
var authHelpers = require('./app/helpers/application_helper');

// JSON Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev')); // for logging requests

app.post('/auth/login', authHelpers.loginRedirect, function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }

  auth.authenticate('local', function(err, user, info) {
    if (err) { handleResponse(res, 500, 'error'); }
    if (!user) { handleResponse(res, 404, 'User not found or incorrect password'); }
    // if (user) { handleResponse(res, 200, 'success'); }
    if (user){
      username = user.username;
      knex('users').where({ username  }).first()
      .then(function(user){
        return res.json({"status": "success", "token": user.token });
      });
      //   return res.json({ token: jwt.sign({id: user.id}, secret) });
    }

  })(req, res, next);
});

app.post('/auth/register', authHelpers.loginRedirect, function(req, res, next){

  return authHelpers.createUser(req, res)
  .then(function(response){
    auth.authenticate('local', function(err, user, info){
      if (user) { handleResponse(res, 200, 'success'); }
    })(req, res, next);
  })
  .catch(function(err){ handleResponse(res, 500, 'User exists'); });
});

// All routes from this point on need to authenticate with bearer:
// Authorization: Bearer <token here>
app.all('*', function(req, res, next) {

  auth.authenticate('bearer', function(err, user, info) {
    if (err) return next(err);
    if (user) {
      req.user = user;
      return next();
    } else {
      return res.status(401).json({ status: 'error', code: 'unauthorized' });
    }
  })(req, res, next);
});

// endpoint to test the API, *with* Authentication
app.get('/hi', function(req, res) {
  return res.json({
    status: 'ok',
    message: 'Hi ' + req.user.username + '!. You have a token.'
  });
});

app.get('/api/users', user.getAllUsers);
app.get('/api/users/:id', user.getSingleUser);

function handleResponse(res, code, statusMsg) {
  res.status(code).json({status: statusMsg});
}

app.listen(port);
