var crypto = require('crypto');
var db = require('../lib/database');

const COLUMNS = ['username', 'password', 'salt',
  'role', 'created_at', 'updated_at'];
const TABLE = 'users';

class User { 
  constructor(data) {
    // populate
    for(var i of COLUMNS) {
      this[i] = data[i];  
    }
    // always do the id
    this.id = data.id;
    
    // register what has changed
    this._delta = []; 
  }

  save(callback) {
    // if it does not have an id, do a full   
    // this time, it is manual
    var self = this;

    if(!callback) callback = () {};
    if(!this.id) {
      db.run(`INSERT INTO ${TABLE} (${COLUMNS.join(',')}) VALUES `
             +`(${"?,".repeat(COLUMNS.length - 1) + "?"});`,
             self.orderedColumns(COLUMNS), (err, row) => {
        if (err) return callback(err);
        self.id = row.lastID;    
        callback(null, self);
      });
    } else {
      db.run(`UPDATE ${TABLE} SET ${this._delta.join('=?,')+'=?'}`
             +`WHERE id = ${this.id} LIMIT 1;`,
             self.orderedColumns(this._delta), (err, row) => {
        // check if it errors        
        if(err) return callback(err);
        
        // reset delta
        this._delta = [];
        callback(null, self);
      });
    }
  }
  
  static authenticate(username, password, callback) {
    db.get('SELECT id, username, password FROM users WHERE username = ? LIMIT 1;',
      [username], (err,row) => {
      if(err) {
        return throw(err);
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
  
}

module.exports = User;
