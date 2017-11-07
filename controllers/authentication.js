const jwt = require('jwt-simple');
const config = require('../config');
const User = require('../models/user');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  // JSON Web Token is a convention that requires a subject property (sub)
  // and an issued-at-time (iat)
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
  // User has already had their email and password auth'd
  // we just need to give them a token
  res.send({ token: tokenForUser(req.user) });
}

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  // validation for presence of both email and password
  if (!email || !password) {
    return res.status(422).send({ error: "Both email and password are required"});
  }

  // see if a user with a given email exists
  User.findOne({ email: email }, function(err, existingUser) {
    if (err) { return next(err); }

    // if a user with that email _does_ exist, return an error
    if (existingUser) {
      // 422 is unprocessable entity - i.e., that email is already taken
      return res.status(422).send({ error: "Email is in use" });
    }

    // if a user with that email does _not_ exist, create and save a new User
    const user = new User({
      email: email,
      password: password
    });

    user.save(function(err) {
      if (err) { return next(err); }

      // Respond to request indicating the user was created
      res.json({ token: tokenForUser(user) });
    });
  });
}
