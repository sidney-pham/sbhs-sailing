const crypto = require('crypto');
const db = require('./db');

// const COLUMNS = ['username', 'password', 'role', 'created_at', 'updated_at'];
// const TABLE = 'Members';

class User {
  constructor(data) {
    this.first_name = data.first_name;
    this.surname = data.surname;
    this.email = data.email;
    this.phone = data.phone;
    this.username = data.username;
    this.student_id = data.student_id;

    this.id = data.id;
  }

  get name() {
    return this.first_name + ' ' + this.surname;
  }

  getEmail() {
    return this.email;
  }

  getPhone() {
    return this.phone;
  }

  getUsername() {
    return this.username;
  }

  getStudentId() {
    return this.student_id;
  }


  updatePassword(newPassword, callback) {

  }



  static authenticate(username, password, callback) {
    db.get('SELECT id, username, password FROM users WHERE username = ? LIMIT 1;',
      [username], (err,row) => {
      if(err) {
        throw(err);
      }

      // convert to user object, and authenticate
      if(row) {
        // check if the password is correct
        user = new User(row);
        user.checkPassword(password, callback);
      } else {
        // return failed
        callback(null, false);
      }

    });
  }

  // in place password check
  checkPassword(password, callback) {
    // perform some pbkdf2
    var id = this.id,
      hash = this.password.split('!'),
      algorithm = hash[0],
      iterations = parseInt(hash[1], 10),
      salt = new Buffer(hash[2], 'base64'),
      hash = new Buffer(hash[3], 'base64'),
      hashSize = hash.length;

    crypto.pbkdf2(password, salt, hashSize, iterations, algorithm,
      (err, key) => {
      if(err) return callback(null, false);
      else callback(null, self.id);

    });
  }

  orderedColumns(colList) {
    var columns = Array(colList.length);
    for(var i in colList) {
      columns[i] = this[colList[i]];
    }
    return columns;
  }

  static getById(userId) {
    const query = 'SELECT first_name, surname, email, phone, username, student_id \
                    FROM Members WHERE id = $1 LIMIT 1';
    return db.one(query, [userId]).then(data => {
      return new User(data);
    }).catch(err => {
      console.error(err);
      console.error(`Couldn\'t get user ${userId}.`);
      // Populate a default user.
      return new DefaultUser();
    });
  }
}

class DefaultUser extends User {
  // ...
}

module.exports = {
  User,
  DefaultUser
};
