let pool = require('../lib/db');

const MEMBER_TYPE_STUDENT = 'Student',
  MEMBER_TYPE_NONSTUDENT = 'NonStudent';

function getAllMembers(req, res) {

}

// NEEDS VALIDATION!!
function createMember(req, res) {
  const memberType = req.body.member_type;

  let sql = 'INSERT INTO Members (member_type, first_name, surname, email, phone) \
  VALUES ($1, $2, $3, $4, $5) RETURNING id';
  // if (memberType == MEMBER_TYPE_STUDENT) {
  //   sql += 'INSERT INTO Students (member_id, student_id) \
  //   VALUES ($1, $2)';
  // } else { // memberType == MEMBER_TYPE_NONSTUDENT
  //   sql += 'INSERT INTO NonStudents (member_id, username, password) \
  //   VALUES ($1, $2, $3)';
  // }

  // Retrieve the data to insert from the POST body
  let data = [
    req.body.member_type,
    req.body.first_name,
    req.body.surname,
    req.body.email,
    req.body.phone
  ];

  pool.query(sql, data, function(queryErr, queryRes) {
    if (queryErr) {
      console.error('Failed to create member:', queryErr);
      return res.status(500).json({
        status: 'Error',
        data: 'Failed to create member'
      });
    }

    console.log(queryRes.rows);

    res.status(201).json({
      blah: 'blah'
    });
  });
}
function updateMember(req, res) {

}
function removeMember(req, res) {

}

function getSingleMember(req, res) {
  res.status(200).json({
    status: 'Success',
    data: req.member
  });
}

function lookupMember(req, res, next) {
  const memberId = req.params.id;
  pool.query('SELECT * FROM Members WHERE id = $1', [memberId], function(queryErr, queryRes) {
    if (queryErr) {
      console.error('Could not retrieve member:', queryErr);
      return res.status(500).json({
        status: 'Error',
        data: 'Could not retrieve member'
      });
    }

    if (queryRes.rowCount == 0) {
      console.error(`No matching member with id ${memberId} in database:`, queryErr);
      return res.status(404).json({
        status: 'Error',
        data: 'No member found'
      });
    }

    const member = queryRes.rows[0];
    console.log(member);
    console.log('TEST:', member.member_type);

    if (member.member_type == MEMBER_TYPE_STUDENT) {
      pool.query('SELECT * FROM Students WHERE member_id = $1', [memberId], function(queryErr, queryRes) {
        if (queryErr) {
          console.error('Could not find member in Students table:', queryErr);
          return res.status(500).json({
            status: 'Error',
            data: 'Could not find member in Students table.'
          });
        }

        // Add data from Students table (and remove duplicate id).
        Object.assign(member, queryRes.rows);
        delete member.member_id;
      });
    } else { // member.member_type == MEMBER_TYPE_STUDENT
      pool.query('SELECT * FROM NonStudents WHERE member_id = $1', [memberId], function(queryErr, queryRes) {
        if (queryErr) {
          console.error('Could not find member in NonStudents table:', queryErr);
          return res.status(500).json({
            status: 'Error',
            data: 'Could not find member in NonStudents table.'
          });
        }

        // Add data from NonStudents table (and remove duplicate id).
        Object.assign(member, queryRes.rows);
        delete member.member_id;
      });
    }

    console.log('Successful query:', member);

    // By attaching a property to the request, its data is now made available
    // in our handler function.
    req.member = member;

    next(); 
  });
}

module.exports = {
  getAllMembers,
  getSingleMember,
  createMember,
  updateMember,
  removeMember,
  lookupMember
};