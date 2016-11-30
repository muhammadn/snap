var express = require('express');
var router = express.Router();
var morgan = require('morgan');
var app = express();

// set the port
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens

// db configuration
var db = require('./config/database');

// controller
var user = require('./app/controllers/users_controller');

app.use(morgan('dev')); // for logging requests

app.get('/api/users', user.getAllUsers);

app.listen(port);
