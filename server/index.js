// Dependencies and setup.
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const graphqlHTTP = require('express-graphql');
const path = require('path');
const config = require('./config');

const app = express();
const { port } = config;

// Compress response bodies.
app.use(compression());

// Enable reading of POST bodies.
app.use(bodyParser.json());

// express-session setup.
app.use(session({
  secret: config.session.secret,
  store: new FileStore(),
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 60 * 60 * 1000 // 1 hour.
  }
}));

app.use((req, res, next) => {
  console.log(`New request to ${req.url}.`);
  next();
});

// Serve GraphQL API.
const schema = require('./schema');
const User = require('./models/user');

function checkAuth(req, res, next) {
  if (req.session.userID) {
    User.getByID(req.session.userID).then(user => {
      if (user == null) {
        console.error(`User ${req.session.userID} not in database.`);
        req.session.destroy();
        return res.redirect('/login');
      }

      if (user.account_disabled) {
        console.error(`User ${req.session.userID}'s account is disabled'.`);
        req.session.destroy();
        return res.redirect('/login');
      }

      req.user = user; // Attach user to req object.
      return next();
    });
  } else {
    console.log('Redirecting to /login.');
    res.redirect('/login');
  }
}

// By default, the Express request is passed as the GraphQL context.
app.use('/graphql', checkAuth, graphqlHTTP({
  schema,
  graphiql: true
}));

// Login.
app.use('/', require('./login'));

// Check authentication before serving index.html. We check authentication
// on the server before sending any response so the user never sees the
// logged-in dashboard if they're not logged in.
app.get('/', checkAuth, (req, res) => {
  const homeURL = path.join(__dirname, '..', 'public', 'index.html');
  res.sendFile(homeURL);
});

// Redirect everything else to /. Because the front-end is an SPA, if the user
// refreshes at say, /rosters, it 404s so instead we redirect them to /.
app.use((req, res) => {
  res.redirect('/');
});

app.listen(port, () => console.log(`App running on port ${port}`));
