const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

// authenticate using jwt strategy, and do not create a session for them
// if they are authenticated (passport wants to make a cookie-based session
// by default)
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {
  // Any requests through '/' must first go through requireAuth step before
  // passing along to the request handler
  app.get('/', requireAuth, function(req, res) {
    res.send({ hi: 'there' });
  });
  // first argument is the route
  // function accepts three arguments:
  // request, response, and next (for error handling)
  app.post('/signin', requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);
}
