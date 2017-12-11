// Helper functions for authentication using SBHS OAuth2 API.
const crypto = require('crypto');
const config = require('../config');

const credentials = {
  client: {
    id: config.oauth2.clientID,
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
function generateAuthURI(redirectURI) {
  const state = crypto.randomBytes(8).toString('hex');
  const authorizationURI = oauth2.authorizationCode.authorizeURL({
    redirect_uri: redirectURI,
    scope: 'all-ro',
    state // https://tools.ietf.org/html/rfc6749#section-4.1.1
  });

  return { authorizationURI, state };
}

// Get access token from SBHS token endpoint.
// options object should contain redirect_uri and code.
async function getAccessToken(options) {
  // Get response from SBHS token endpoint.
  const token = await oauth2.authorizationCode.getToken(options);
  // Create token with useful helper methods.
  const accessToken = oauth2.accessToken.create(token);

  return accessToken;
}

module.exports = {
  generateAuthURI,
  getAccessToken
};
