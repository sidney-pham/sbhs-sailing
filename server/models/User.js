// User class.
const db = require('../lib/db');
const pg = require('pg-promise');

class User {
  constructor(data) {
    this.id = data.id;
    this.first_name = data.first_name;
    this.surname = data.surname;
    this.email = data.email;
    this.phone = data.phone;
    this.username = data.username; // TODO: Remove?
    this.password = data.password;
    this.student_id = data.student_id;
    this.is_disabled = data.is_disabled;
    this.first_login = data.first_login;
    this.user_level = data.user_level;
  }

  // Return an easily displayable name. Display full name unless name too long.
  get name() {
    let name;
    if (this.first_name && this.surname) {
      name = this.first_name + ' ' + this.surname;
      name = name.length > 30 ? this.first_name : name;
    } else {
      name = 'No Name';
    }
    return name;
  }

  // Return all users if administrator.
  static getAll(userId) {
    const query = 'SELECT user_level FROM Members WHERE id = $1';
    return db.one(query, userId).then(() => {
      const query = 'SELECT * FROM MEMBERS WHERE id != $1 ORDER BY id';
      return db.any(query, userId);
    });
  }

  // Return a user, or null if no user exists.
  static getById(userId) {
    const query = 'SELECT * FROM Members WHERE id = $1 LIMIT 1';
    return db.one(query, [userId]).then(data => {
      return new User(data);
    }).catch(err => {
      console.error(err);
      console.error(`Couldn\'t get user ${userId}.`);
      return null;
    });
  }

  // Return a user, or null if no user exists.
  static getByStudentId(studentId) {
    const query = 'SELECT * FROM Members WHERE student_id = $1 LIMIT 1';
    return db.one(query, [studentId]).then(data => {
      return new User(data);
    }).catch(err => {
      console.error(`Couldn't get user with student id ${studentId}.`);
      return null;
    });
  }

  // Return user if authentication successful.
  static authenticate(email, password) {
    const query = 'SELECT id, password, is_disabled FROM Members WHERE email = $1 LIMIT 1';

    return db.oneOrNone(query, [email]).then(user => {
      if (!user) {
        throw new Error('Incorrect username or password.');
      }

      if (user.password === password) {
        // User account disabled.
        if (user.is_disabled) {
          throw new Error('User account disabled.');
        }

        // Successful.
        return user.id;
      } else {
        // Wrong password.
        throw new Error('Incorrect username or password.');
      }
    });
  }

  static create(data) {
    const columns = Object.keys(data);
    let variables = columns.map(column => data[column]);
    variables.push(this.id);

    let i = 1;
    const query = `INSERT INTO Members (${columns.join(', ')}) VALUES (${columns.map(_ => '$' + i++).join(', ')}) RETURNING *`;

    return db.one(query, variables).catch(err => {
      console.error(`Error updating user ${this.id}: `, err);
    });
  }

  // Update user. TODO: Probably is a security flaw somewhere here. Fix it.
  update(data) {
    const columns = Object.keys(data);
    let variables = columns.map(column => data[column]);
    variables.push(this.id);

    let i = 1;
    const query = `UPDATE Members SET (${columns.join(', ')}) = \
      (${columns.map(_ => '$' + i++).join(', ')}) \
      WHERE id = $${columns.length + 1}`;

    return db.none(query, variables);
  }
}

module.exports = User;
