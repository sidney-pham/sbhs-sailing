// Router for regular login and SBHS login.
module.exports = router => {
  const User = require('../models/User');
  const sbhsAuth = require('../lib/sbhs-oauth2');

  // res.json an object to the client to handle redirect/display of login errors.
  router.post('/login', (req, res) => {
    const {email, password} = req.body;
    console.log(`Login attempt from ${email}.`);
    User.authenticate(email, password).then(id => {
      req.session.userId = id;
      res.json({
        'logged_in': true
      });
    }).catch(err => {
      res.json({
        'logged_in': false,
        'message': err.message
      });
    });
  });

  router.get('/logout', (req,res) => {
    req.session.userId = null;
    req.session.save(() => {
      res.redirect('/');
    });
  });

  // SBHS Login
  // Redirect login to SBHS Authorisation endpoint.
  router.get('/login/sbhs', (req, res) => {
    // Detect protocol and host to set redirectUri.
    const redirectUri = `${req.protocol}://${req.get('host')}/login/sbhs/callback`;
    const {authorizationUri, state} = sbhsAuth.generateAuthURI(redirectUri);

    // Store state so it can be verified later to prevent CSRF attacks.
    // https://tools.ietf.org/html/rfc6749#section-10.12
    req.session.state = state;

    console.log(`Redirecting to: ${authorizationUri} for auth.`);
    res.redirect(authorizationUri);
  });

  // Parse authorization token and request access token on callback.
  router.get('/login/sbhs/callback', (req, res) => {
    // Detect protocol and host to set redirectUri.
    const redirectUri = `${req.protocol}://${req.get('host')}/login/sbhs/callback`;

    // The code in the query parameter from authorization endpoint.
    const {code, state} = req.query;
    const options = {
      code,
      redirect_uri: redirectUri
    };

    if (state != req.session.state) {
      return res.json({
        'message': 'State value tampered with.'
      });
    }

    req.session.state = null;

    sbhsAuth.authenticate(options).then(userId => {
      req.session.userId = userId;
      req.session.save(() => {
        res.redirect('/');
      });
    }).catch(err => {
      res.json({
        'message': 'User not authorised to use Sailing Portal.'
      });
    });
  });
};
