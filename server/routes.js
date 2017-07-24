const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/../static/login.html'));
});

router.get('/home', (req, res) => {
  res.render('home', {

  });
});

router.get('/results', (req, res) => {
  res.render('results', {

  });
});

router.get('/rosters', (req, res) => {
  res.render('rosters', {

  });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  // TODO(sidney-pham): Implement.


  res.redirect('/home');
});

module.exports = router;
