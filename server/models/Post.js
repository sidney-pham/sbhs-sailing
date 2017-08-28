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

  static get(userId) {
    const query = 'SELECT n.id, n.title, n.content, n.md_content, n.created_at, n.modified_at, \
      n.created_by, n.modified_by, m.first_name || \' \' || m.surname AS author_name, \
      (SELECT Count(*) FROM Likes WHERE Likes.post_id = n.id) AS like_count, \
      (SELECT Count(*) FROM Likes WHERE Likes.post_id = n.id AND Likes.member_id = $1) AS user_liked \
      FROM News n INNER JOIN Members m ON n.created_by = m.id \
      ORDER BY created_at DESC';

    return db.any(query, userId).then(posts => {
      posts.map((row, i) => {
        row.created_at_relative = moment(row.created_at).fromNow();
        row.user_liked = row.user_liked == '1';
        row.user_is_author = row.created_by == userId;
      });

      // console.log(posts);
      return posts;
    });
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

  static delete(postId, userId) {
    // Check the author. Then delete, else throw an error.
    const query = 'DELETE FROM News WHERE id = $1 AND created_by = $2 RETURNING *';
    return db.oneOrNone(query, [postId, userId]).then(data => {
      if (data === null) { // Author doesn't match.
        throw new Error('User doesn\'t have the right permissions.');
      }
    });
  }

  static like(postId, userId) {
    let query = 'SELECT * FROM Likes WHERE post_id = $1 AND member_id = $2';
    return db.oneOrNone(query, [postId, userId]).then(data => {
      if (data) { // Row exists.
        query = 'DELETE FROM Likes WHERE post_id = $1 AND member_id = $2; \
        SELECT count(post_id) FROM Likes WHERE post_id = $1';
        return db.one(query, [postId, userId]).then(data => {
          data.like_status = 'unliked';
          return data;
        });
      } else {
        query = 'INSERT INTO Likes (post_id, member_id) VALUES ($1, $2); \
        SELECT count(post_id) FROM Likes WHERE post_id = $1';
        return db.one(query, [postId, userId]).then(data => {
          data.like_status = 'liked';
          return data;
        });
      }
    });

  }
}

module.exports = Post;
