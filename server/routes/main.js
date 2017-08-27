// Main router.
const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const sbhsAuth = require('../lib/sbhs-oauth2');

// Use login router.
let router = express.Router();
require('./login')(router);

// Middleware function to ensure user permitted to access logged-in content.
function checkAuth(req, res, next) {
  console.log('checkAuth:', req.session.userId);
  if (req.session.userId) {
    User.getById(req.session.userId).then(user => {
      if (user == null) {
        console.error(`User ${req.session.userId} not in database.`);
        req.session.destroy();
        return res.redirect('/');
      }

      if (user.is_disabled) {
        console.error(`User ${req.session.userId}'s account is disabled'.`);
        req.session.destroy();
        return res.redirect('/');
      }

      // Redirect to /start on first login.
      // Redirect to /start if full name not provided yet.
      if ((user.first_login || !user.first_name || !user.surname) && req.path != '/start') {
        return res.redirect('/start');
      }

      req.user = user; // Attach user to req object.
      res.locals.user = user; // Set context for templating engine.
      next();
    });
  } else {
    res.redirect('/');
  }
}

router.get('/', (req, res, next) => {
  console.log('checkAuth:', req.session.userId);
  if (req.session.userId) {
    res.redirect('/home');
  } else {
    next();
  }
}, (req, res) => {
  res.render('login');
});

router.get('/home', checkAuth, (req, res) => {
  res.render('home');
});

router.get('/results', checkAuth, (req, res) => {
  res.render('results');
});

router.get('/rosters', checkAuth, (req, res) => {
  res.render('rosters');
});

router.get('/start', checkAuth, (req, res) => {
  // Make sure user isn't already initialised.
  if (!req.user.first_login && req.user.first_name && req.user.surname) {
    return res.redirect('/home');
  }

  res.render('start', {
    user: req.user
  });
});

router.post('/start', checkAuth, (req, res) => {
  const {first_name, surname, email, phone} = req.body;

  req.user.update({
    first_name,
    surname,
    email,
    phone,
    first_login: false
  }).then(() => {
    // Redirect on submit because users can modify settings later anyway.
    res.redirect('/');
  }).catch(() => {
    res.render('start');
  });
});

module.exports = router;
