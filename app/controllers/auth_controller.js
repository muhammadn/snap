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
      signed_token = jwt.sign({id: user.id}, process.env.SECRET_KEY);
      knex('users').where({ username })
      .update({token: signed_token })
      .then(function(){
        return done(null, user);
      });
    }
  })
  .catch(function(err){ return done(err); });
}));

passport.use(new BearerStrategy(function (token, done) {
  jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
    if (err) return done(err);
    knex('users').where({ token }).first()
    .then(function(user){ 
      if(!user){
        return done(null, false);
      }
      else {
        var authorized_user = user;
        return done(null, authorized_user);
      }
    })
  });
}));

module.exports = passport;
