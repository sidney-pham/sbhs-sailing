// Dependencies and Setup
const express = require('express');
const nunjucks = require('nunjucks');
const compression = require('compression');
const bodyParser = require('body-parser');
// const auth = require('./auth');
// const pg = require('pg-promise');
const app = express();

// const db = pg('postgres://localhost:5432/sailing');

const port = parseInt(process.argv[2], 10) || process.env.PORT || '3000';

// Nunjucks
app.set('view engine', 'njk');
const nunjucksEnv = nunjucks.configure(__dirname + '/../templates', {
  watch: true,
  express: app
});

// Compress response bodies for all requests.
app.use(compression());

// Enable reading of POST bodies.
app.use(bodyParser.json({type: 'application/json'}));

// Serve static files at ../static to /.
app.use(express.static(__dirname + '/../static'));

// Get config file and call auth function with appropriate arguments.
// var config = require('./config').config;
// auth(app, config.clientId, config.clientSecret, config.host + ":" + port);

app.use(require('./routes'));

// Listen for connections.
app.listen(port, function() {
  console.log(`App listening on port ${port}!`);
});
