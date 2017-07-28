const db = require('./db');

class User {
  constructor(data) {
    this.first_name = data.first_name;
    this.surname = data.surname;
    this.email = data.email;
    this.phone = data.phone;
    this.username = data.username; // TODO: Remove?
    this.student_id = data.student_id;
    this.id = data.id;
  }

  get name() {
    return this.first_name + ' ' + this.surname;
  }

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

  static getByStudentId(studentId) {
    
  }
}

module.exports = User;
