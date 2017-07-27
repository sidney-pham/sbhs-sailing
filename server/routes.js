const express = require('express');
const path = require('path');
const db = require('./db');
const {User, DefaultUser} = require('./User');

const router = express.Router();

router.get('/', (req, res, next) => {
  if (req.session.userId) {
    res.redirect('/home');
  } else {
    next();
  }
}, (req, res) => {
  res.render('login');
});

router.get('/home', checkAuth, (req, res) => {
  User.getById(req.session.userId).then(user => {
    res.render('home', {
      user: user
    });
  });
});

router.get('/results', checkAuth, (req, res) => {
  User.getById(req.session.userId).then(user => {
    res.render('results', {
      user: user
    });
  });
});

router.get('/rosters', checkAuth, (req, res) => {
  User.getById(req.session.userId).then(user => {
    res.render('rosters', {
      user: user
    });
  });
});

router.post('/login', (req, res) => {
  let {username, password} = req.body;
  console.log(`Login request from ${username}.`);
  let query = 'SELECT id, password FROM Members WHERE username = $1 LIMIT 1';

  db.one(query, [username]).then(user => {
    if (user.password === password) {
      // Successful.
      console.log(`${username} logged in.`);

      req.session.userId = user.id;
      res.json({
        'logged_in': true
      });
    } else {
      // Wrong password.
      console.log(`${username} failed to log in.`);
      res.json({
        'logged_in': false,
        'message': 'Incorrect username or password.'
      });
    }
  }).catch(err => {
    // Couldn't find username.
    console.error('Query error: ', err);

    res.json({
      'logged_in': false,
      'message': 'Incorrect username or password.'
    });
  });
});

router.get('/logout', (req,res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/');
});

function checkAuth(req, res, next) {
  console.log('checkAuth:', req.session.userId);
  if (!req.session.userId) {
    res.redirect('/');
  } else {
    next();
  }
}

module.exports = router;
