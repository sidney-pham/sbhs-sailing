// Helper functions for authentication using SBHS OAuth2 API.

const crypto = require('crypto');
const request = require('request-promise-native');
const config = require('../config');
const User = require('../models/User');

const credentials = {
  client: {
    id: config.oauth2.clientId,
    secret: config.oauth2.clientSecret
  },
  auth: {
    tokenHost: 'https://student.sbhs.net.au',
    tokenPath: '/api/token',
    authorizePath: '/api/authorize'
  }
};

const oauth2 = require('simple-oauth2').create(credentials);

// Generate URI to SBHS authorisation endpoint.
function generateAuthURI(redirectUri) {
  const state = crypto.randomBytes(8).toString('hex');
  const authorizationUri = oauth2.authorizationCode.authorizeURL({
    redirect_uri: redirectUri,
    scope: 'all-ro',
    state: state // https://tools.ietf.org/html/rfc6749#section-4.1.1
  });

  return {authorizationUri, state};
}

// Get access token, then user information from SBHS API and return User from student id.
function authenticate(options) {
  return oauth2.authorizationCode.getToken(options).then(result => {
    // Create token with useful helper methods.
    const token = oauth2.accessToken.create(result);
    console.log('Access token received.', token);

    return token;
  }).catch(err => {
    console.error('Failed to get access token.');
  }).then(token => {
    return request('https://student.sbhs.net.au/api/details/userinfo.json', {
      'auth': {
        // https://tools.ietf.org/html/rfc6749#section-7
        'bearer': token.token.access_token
      }
    });
  }).catch(err => {
    console.error('Failed to get user details from SBHS API.');
  }).then(data => {
    data = JSON.parse(data);
    console.log('User data from SBHS API:', data);
    const studentId = data.username;

    return User.getByStudentId(studentId);
  }).then(user => {
    if (!user) {
      throw new Error('No user found.');
    }

    if (user.is_disabled) {
      throw new Error('Account disabled.');
    }

    return user.id;
  });
}

module.exports = {
  generateAuthURI,
  authenticate
};
