const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  // verify email and password, call done with User once authenticated, else
  // call done with `false`.
  // DB search is asynchronous, thus the need for a callback function
  User.findOne({ email: email }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }

    // compare passwords - is `password` the same as user.password?
    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false) }

      return done(null, user);
    });
  });

});

// Setup options for JWT Strategy
// explicitly tell where to find JWT on the request in `jwtFromRequest`
//
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JWT Strategy with options and function to be run when
// someone attempts to authenticate with a JWT
// `payload` argument is decoded JWT token, containing `sub` and `iat` properties
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // See if the user id in the payload exists in our db
  User.findById(payload.sub, function(err, user) {

    if (err) { return done(err, false); }

    // if it does, call 'done' with that user, else call 'done' without a user
    if(user) {
      return done(null, user);
    } else {
      return done(null, false);
    }

  });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
