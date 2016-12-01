const knex = require('../../config/connection');
var config = require('../../config/application');
var authHelpers = require('../helpers/application_helper');
var passport = require("passport");
var passportBearer = require("passport-http-bearer");
var passportLocal = require("passport-local");
var jwt = require('jsonwebtoken');
var BearerStrategy = passportBearer.Strategy;
var LocalStrategy = passportLocal.Strategy;

passport.use(new LocalStrategy(function(username, password, done){
  // check to see if the username exists
  knex('users').where({ username }).first()
  .then(function(user) {
    if (!user) return done(null, false);
    if (!authHelpers.comparePass(password, user.password)) {
      return done(null, false);
    } else {
      return done(null, user);
    }
  })
  .catch((err) => { return done(err); });

}));

passport.use(new BearerStrategy(function (token, done) {
  jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
    if (err) return done(err);
    var user = users[decoded.id];
    return done(null, user ? user : false);
  });
}));

module.exports = passport;
