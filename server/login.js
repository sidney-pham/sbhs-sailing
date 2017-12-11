const express = require('express');
const fetch = require('node-fetch');
const User = require('./models/user');
const sbhsAuth = require('./utilities/sbhs-oauth2');

const router = express.Router();

// Hack to handle asynchronous errors. Needs to be wrapped around any
// route handlers in which asynchronous errors can occur.
function wrapAsync(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}

// Email and password login.
router.post('/login', wrapAsync(async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const id = await User.authenticate(email, password);
    req.session.userID = id;
    res.json({
      success: true
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
}));

router.get('/logout', (req, res) => {
  req.session.userID = null;
  res.redirect('/');
});

// SBHS Login.
// Redirect to SBHS Authorisation endpoint.
router.get('/login/sbhs', (req, res) => {
  const redirectURI = `${req.protocol}://${req.get('host')}/login/sbhs/callback`;
  const { authorizationURI, state } = sbhsAuth.generateAuthURI(redirectURI);

  // Store state so it can be verified later to prevent CSRF attacks.
  // https://tools.ietf.org/html/rfc6749#section-10.12
  req.session.state = state;

  console.log(`Redirecting to: ${authorizationURI} for auth.`);
  res.redirect(authorizationURI);
});

// Get authorisation code, get access token, get student ID, find corresponding
// user in database.
router.get('/login/sbhs/callback', wrapAsync(async (req, res) => {
  const { state, code } = req.query;

  if (state !== req.session.state) {
    return res.json({
      success: false,
      message: 'State value tampered with.'
    });
  }

  req.session.state = null;

  try {
    const redirectURI = `${req.protocol}://${req.get('host')}/login/sbhs/callback`;
    const accessToken = await sbhsAuth.getAccessToken({
      code,
      redirect_uri: redirectURI
    });

    // Fetch student ID from API and return corresponding user from database.
    const SBHSData = await fetch('https://student.sbhs.net.au/api/details/userinfo.json', {
      method: 'GET',
      headers: {
        // https://tools.ietf.org/html/rfc6749#section-7
        Authorization: `Bearer ${accessToken.token.access_token}`
      }
    }).then(response => response.json());

    console.log(SBHSData);

    const studentID = SBHSData.username;
    const user = await User.getByStudentID(studentID);
    req.session.userID = user.id;
    return res.redirect('/');
  } catch (error) {
    return res.json({
      success: false,
      message: error.message
    });
  }
}));

router.use((err, req, res, next) => {
  // Delegate error handling to Express when headers have already been sent
  // so Express closes the connection and fails the request.
  if (res.headersSent) {
    return next(err);
  }
  console.error(err);
  return res.json({
    success: false,
    message: err.message
  });
});

module.exports = router;
