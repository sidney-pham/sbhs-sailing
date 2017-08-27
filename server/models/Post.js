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
    this.id = data.id;
    this.title = data.title;
    this.content = data.content;
    this.created_at = data.created_at;
    this.modified_at = data.modified_at;
    this.created_by = data.created_by;
    this.modified_by = data.modified_by;
    this.author_name = data.author_name;
  }

  static get() {
    const query = 'SELECT n.id, n.title, n.content, n.created_at, n.modified_at, \
      n.created_by, n.modified_by, m.first_name || \' \' || m.surname as author_name \
      FROM News n INNER JOIN Members m ON n.created_by = m.id \
      ORDER BY created_at DESC';

    return db.any(query);

    // const query = 'SELECT author_id, creation_timestamp, title, content, md_content FROM News ORDER BY creation_timestamp DESC';
    //
    // return db.any(query).then(posts => {
    //   return Promise.all(posts.map((row, i) => {
    //     return User.getById(row.author_id).then(user => {
    //       row.creation_time = moment(row.creation_timestamp).fromNow();
    //       row.author = user.name; // May be null if User.getById rejects.
    //       return row;
    //     });
    //   }));
    // });
  }

  static add(post) {
    const query = 'INSERT INTO News (created_by, title, content, md_content) VALUES \
    ($1, $2, $3, $4) RETURNING *';
    return db.one(query, [post.created_by, post.title, post.content, marked(post.content)]);
  }

  static edit(id, newPost) { // TODO
    const query = 'UPDATE News SET title = $1, content = $2, md_content = $3, \
    modified_by = $4 WHERE id = $5 RETURNING *';
    return db.one(query, [newPost.title, newPost.content, marked(newPost.content), newPost.edited_by, id]);
  }

  static delete(id) {
    const query = 'DELETE FROM News WHERE id = $1';
    return db.none(query, [id]);
  }
}

module.exports = Post;
