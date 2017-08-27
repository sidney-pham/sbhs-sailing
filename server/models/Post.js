// Post class.
const db = require('../lib/db');
const pg = require('pg-promise');
const User = require('./User');
const moment = require('moment');
const marked = require('marked');

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});

class Post {
  constructor(data) {
    this.author = data.author;
    this.title = data.title;
    this.date = data.date;
    this.content = data.content;
    // this.postId =
  }

  static getPosts() {
    const query = 'SELECT author_id, creation_timestamp, title, content, md_content FROM News ORDER BY creation_timestamp DESC';

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
    const query = 'INSERT INTO News (author_id, creation_timestamp, title, content, md_content) VALUES \
    ($1, CURRENT_TIMESTAMP, $2, $3, $4)';
    return db.none(query, [post.id, post.title, post.content, marked(post.content)]);
  }

  static editPost(id, newPost) { // TODO
    const query = 'UPDATE News SET edit_timestamp = CURRENT_TIMESTAMP, \
    title = $1, content = $2, md_content = $3, editor_id = $4 WHERE id = $5 RETURNING *';
    return db.one(query, [newPost.title, newPost.content, marked(newPost.content), newPost.editor_id, id]);
  }

  static deletePost(id) {
    const query = 'DELETE FROM News WHERE id = $1';
    return db.none(query, [id]);
  }
}

module.exports = Post;
