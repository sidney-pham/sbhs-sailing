// Post class.
const db = require('../lib/db');
const pg = require('pg-promise');
const User = require('./User');
const moment = require('moment');

class Post {
  constructor(data) {
    this.author = data.author;
    this.title = data.title;
    this.date = data.date;
    this.content = data.content;
    // this.postId =
  }

  static getPosts() {
    const query = 'SELECT author_id, creation_timestamp, title, content FROM News ORDER BY creation_timestamp DESC';

    return db.any(query).then(posts => {
      return Promise.all(posts.map((row, i) => {
        return User.getById(row.author_id).then(user => {
          row.creation_time = moment(row.creation_timestamp).fromNow();
          row.author = user.name; // May be null if User.getById rejects.
          return row;
        });
      }));
    });
  }

  static addPost(post) {
    const query = 'INSERT INTO News (author_id, creation_timestamp, title, content) VALUES \
    ($1, CURRENT_TIMESTAMP, $2, $3)';
    return db.none(query, [post.id, post.title, post.content]);
  }
}

module.exports = Post;
