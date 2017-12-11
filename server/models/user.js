const db = require('../utilities/db');

class User {
  static async authenticate(email, password) {
    const query = 'SELECT id, account_disabled FROM Users WHERE email = $1 AND password = $2';
    const user = await db.oneOrNone(query, [email, password]);

    if (!user) {
      throw new Error('Incorrect username or password.');
    }

    if (user.account_disabled) {
      throw new Error('User account disabled.');
    }

    return user.id;
  }

  static async getByStudentID(studentID) {
    const query = 'SELECT * FROM Users WHERE student_id = $1';
    const user = await db.oneOrNone(query, [studentID]);

    if (!user) {
      throw new Error(`No user with student ID ${studentID} in database.`);
    }

    if (user.account_disabled) {
      throw new Error('User account disabled.');
    }

    return user;
  }
}

module.exports = User;
