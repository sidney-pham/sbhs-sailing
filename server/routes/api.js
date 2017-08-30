const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const Roster = require('../models/Roster');

const router = express.Router();

// Middleware function to ensure user permitted to access logged-in content.
function checkAuth(req, res, next) {
  console.log('apiCheckAuth:', req.session.userId);
  if (req.session.userId) {
    User.getById(req.session.userId).then(user => {
      if (user == null) {
        console.error(`User ${req.session.userId} not in database.`);
        req.session.destroy();
        return res.json({
          'success': false,
          'message': 'User doesn\'t exist.'
        });
      }

      if (user.is_disabled) {
        console.error(`User ${req.session.userId}'s account is disabled'.`);
        req.session.destroy();
        return res.json({
          'success': false,
          'message': 'User account disabled.'
        });
      }

      req.user = user; // Attach user to req object.
      next();
    });
  } else {
    res.json({
      'success': false,
      'message': 'Not logged in.'
    });
  }
}

router.use(checkAuth);

router.get('/news', (req, res) => {
  Post.get(req.user.id).then(posts => {
    res.json({
      'success': true,
      'data': posts
    });
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      'success': false,
      'message': err.message
    });
  });
});

router.post('/news', (req, res) => {
  const {title, content} = req.body;
  console.log(req.body);
  Post.add({created_by: req.user.id, title, content}).then(() => {
    res.json({
      'success': true
    });
  }).catch(err => {
    res.json({
      'success': false,
      'message': err.message
    });
  });
});

router.put('/news/:post_id', (req, res) => {
  const post_id = req.params.post_id;
  const {title, content} = req.body;
  console.log(req.body);
  console.log(title, content);

  Post.edit(post_id, {edited_by: req.user.id, title, content}).then(newPost => {
    res.json(Object.assign({
      'success': true,
      'message': `News item ${post_id} updated.`
    }, newPost));
  }).catch(err => {
    res.json({
      'success': false,
      'message': err.message
    });
  });
});

router.delete('/news/:post_id', (req, res) => { // TODO: auth.
  const post_id = req.params.post_id;
  const user_id = req.user.id;

  Post.delete(post_id, user_id).then(() => {
    res.json({
      'success': true,
      'message': `News item ${post_id} deleted.`
    });
  }).catch(err => {
    res.json({
      'success': false,
      'message': err.message
    });
  });
});

router.get('/news/like/:post_id', (req, res) => {
  const post_id = req.params.post_id;

  return Post.like(post_id, req.user.id).then(data => {
    console.log(data);
    res.json({
      'success': true,
      'like_status': data.like_status,
      'like_count': data.count
    });
  }).catch(err => {
    res.json({
      'success': false,
      'message': err.message
    });
  });
});

router.get('/rosters', (req, res) => {
  Roster.get().then(roster => {
    console.log('GET /rosters', roster);
    res.json({
      'success': true,
      'data': roster
    });
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      'success': false,
      'message': err.message
    });
  });
});

router.post('/rosters', (req, res) => {
  const {name, start_date, end_date, location, details, boats} = req.body;

  Roster.add({name, start_date, end_date, location, details, boats}).then(() => {
    res.json({
      'success': true
    });
  }).catch(err => {
    res.json({
      'success': false,
      'message': err.message
    });
  });
})

module.exports = router;
