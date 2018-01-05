// Dependencies and setup.
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const graphqlHTTP = require('express-graphql');
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

// Serve GraphQL API.
const schema = require('./schema');

// TODO: Add authentication middleware here.
// By default, the Express request is passed as the GraphQL context.
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

// Login.
app.use('/', require('./login'));

// Redirect everything else to /. Because the front-end is an SPA, if the user
// refreshes at say, /rosters, it 404s so instead we redirect them to /.
// TODO: Redirect unauthenticated users to /login.
app.use((req, res) => {
  res.redirect('/');
});

app.listen(port, () => console.log(`App running on port ${port}`));
