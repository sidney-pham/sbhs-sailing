// Fill this out and rename it to config.js.
const config = {
  // Port the server runs on.
  port: '...',
  // E.g., postgres://localhost:5432/sailing
  database: '...',
  session: {
    secret: '...'
  },
  oauth2: {
    clientID: '...',
    clientSecret: '...'
  }
};

module.exports = config;
