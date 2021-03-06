const db = require('../utilities/db');
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
  static async get(postID, userID) {
    const query = `SELECT *, (SELECT Count(*) FROM Likes WHERE Likes.post_id = p.id) AS likes,
      (EXISTS (SELECT * FROM Likes WHERE Likes.post_id = p.id AND Likes.user_id = $1)) AS user_liked
      FROM Posts AS p WHERE p.id = $2`;
    return db.one(query, [userID, postID]);
  }

  static async getAll(userID, sort) {
    const query = `SELECT *, (SELECT Count(*) FROM Likes WHERE Likes.post_id = p.id) AS likes,
      (EXISTS (SELECT * FROM Likes WHERE Likes.post_id = p.id AND Likes.user_id = $1)) AS user_liked
      FROM Posts AS p`;

    const posts = await db.any(query, [userID, sort]);
    // I don't know how Array.prototype.sort() works but, this seems to work.
    posts.sort((a, b) => {
      if (sort === 'old') {
        return a.created_at - b.created_at;
      } else if (sort === 'top') {
        return b.likes - a.likes;
      } else {
        // sort === 'new', probably.
        return b.created_at - a.created_at;
      }
    });
    return posts;
  }

  static async add(title, content, userID) {
    // Form validation.
    if (!validatePost(title, content)) {
      return Promise.reject(new Error('Post is not valid.'));
    }

    const query = `INSERT INTO Posts (title, content, markdown_content, created_by) VALUES
      ($1, $2, $3, $4) RETURNING id`;
    const postID = await db.one(query, [title, content, marked(content), userID]).then(row => row.id);

    // Return post.
    return Post.get(postID, userID);
  }

  static async like(postID, userID) {
    // Check if user already liked post.
    let query = 'SELECT * FROM Likes WHERE post_id = $1 AND user_id = $2';
    const alreadyLiked = await db.oneOrNone(query, [postID, userID]);

    // Add or delete like.
    if (alreadyLiked) {
      query = 'DELETE FROM Likes WHERE post_id = $1 AND user_id = $2;';
    } else {
      query = 'INSERT INTO Likes (post_id, user_id) VALUES ($1, $2);';
    }
    await db.none(query, [postID, userID]);

    // Return post.
    return Post.get(postID, userID);
  }

  static async pin(postID, userID) {
    let query = 'SELECT user_level FROM Users WHERE id = $1';
    const userLevel = await db.one(query, userID).then(row => row.user_level);
    // Only admins can pin posts.
    if (userLevel === 'admin') {
      query = 'UPDATE Posts SET pinned = NOT pinned WHERE id = $1';
      await db.none(query, postID);

      // Return post.
      return Post.get(postID, userID);
    } else {
      return Promise.reject(new Error('User not allowed to pin posts.'));
    }
  }

  static async update(postID, userID, title, content) {
    // Form validation.
    if (!validatePost(title, content)) {
      return Promise.reject(new Error('Post is not valid.'));
    }

    const query = `UPDATE Posts SET title = $1, content = $2, markdown_content = $3, modified_by = $4
      WHERE id = $5`;
    await db.none(query, [title, content, marked(content), userID, postID]);

    // Return post.
    return Post.get(postID, userID);
  }

  static async delete(postID, userID) {
    // Check the author. Then delete, else throw an error.
    const query = 'SELECT user_level FROM Users WHERE id = $1';
    const userLevel = await db.one(query, [userID]).then(row => row.user_level);
    let deletedPostID;

    if (userLevel === 'admin') {
      // Can delete any post.
      const query = 'DELETE FROM Posts WHERE id = $1 RETURNING id';
      deletedPostID = await db.one(query, [postID]).then(row => row.id);
    } else {
      // Must own the post.
      const query = 'DELETE FROM Posts WHERE id = $1 AND created_by = $2 RETURNING id';
      deletedPostID = await db.oneOrNone(query, [postID, userID]);
      if (!deletedPostID) { // Author doesn't match.
        return Promise.reject(new Error('User doesn\'t have the right permissions.'));
      }
    }

    return deletedPostID;
  }
}

const maxTitleLength = 100;
const maxContentLength = 10000;

function validatePost(title, content) {
  let valid = true;

  if (!title || !content) {
    valid = false;
  }

  if (title.length > maxTitleLength || content.length > maxContentLength) {
    valid = false;
  }

  return valid;
}

module.exports = Post;
