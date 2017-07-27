// Dependencies and Setup
const express = require('express');
const nunjucks = require('nunjucks');
const compression = require('compression');
const bodyParser = require('body-parser');
const session = require('express-session');
var FileStore = require('session-file-store')(session);
// const auth = require('./auth');
const app = express();

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
// app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({type: 'application/json'}));

// express-session setup.
app.use(session({
  secret: 'secret',
  store: new FileStore(),
  cookie: {
    maxAge: 60 * 60 * 1000 // 1 hour.
  }
}));

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
