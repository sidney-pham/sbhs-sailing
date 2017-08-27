const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');

const router = express.Router();

// Middleware function to ensure user permitted to access logged-in content.
// TODO: Fix return values.
function checkAuth(req, res, next) {
  console.log('checkAuth:', req.session.userId);
  if (req.session.userId) {
    User.getById(req.session.userId).then(user => {
      if (user == null) {
        console.error(`User ${req.session.userId} not in database.`);
        req.session.destroy();
        return res.json({
          // TODO
        });
      }

      if (user.is_disabled) {
        console.error(`User ${req.session.userId}'s account is disabled'.`);
        req.session.destroy();
        return res.json({});
      }

      req.user = user; // Attach user to req object.
      res.locals.user = user; // Set context for templating engine.
      next();
    });
  } else {
    res.json({});
  }
}

router.get('/news', (req, res) => {
  const params = req.query; // TODO
  Post.getPosts().then(posts => {
    res.json(posts);
  });
});

router.post('/news', checkAuth, (req, res) => {
  const {title, content} = req.body;
  console.log(req.body);
  Post.addPost({id: req.user.id, title, content}).then(() => {
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
  console.log(post_id);



  res.json({
    'success': true,
    'message': `News item ${post_id} updated.`
  });
});

router.delete('/news/:post_id', checkAuth, (req, res) => {

});

module.exports = router;
