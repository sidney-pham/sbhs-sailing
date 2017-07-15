let pool = require('../lib/db');

const MEMBER_TYPE_STUDENT = 'Student',
  MEMBER_TYPE_NONSTUDENT = 'NonStudent';

const NON_STUDENT = ['username', 'password'],
  STUDENT = ['student_id'];

function getAllMembers(req, res) {
  pool.query('SELECT * FROM Members', (queryErr, queryRes) => {
    if (queryErr) {
      console.error('Failed to get all members:', queryErr);
      return res.status(500).json({
        status: 'Error',
        data: 'Failed to get all members.'
      });
    }

    res.status(200).json({
      status: 'Success',
      data: queryRes.rows
    });
  });
}

// NEEDS VALIDATION!!
// Validate req.body, and has appropriate properties for their member_type.
function createMember(req, res) {
  const memberType = req.body.member_type;

  let sql = 'INSERT INTO Members (member_type, first_name, surname, email, phone) \
  VALUES ($1, $2, $3, $4, $5) RETURNING id';
  // Retrieve the data to insert from the POST body
  let data = [
    req.body.member_type,
    req.body.first_name,
    req.body.surname,
    req.body.email,
    req.body.phone
  ];

  pool.query(sql, data, (queryErr, queryRes) => {
    if (queryErr) {
      console.error('Failed to create member:', queryErr);
      return res.status(500).json({
        status: 'Error',
        data: 'Failed to create member.'
      });
    }

    const memberId = queryRes.rows[0].id;

    if (memberType == MEMBER_TYPE_STUDENT) {
      let sql = 'INSERT INTO Students (member_id, student_id) \
      VALUES ($1, $2)';
      let data = [memberId, req.body.student_id];
      pool.query(sql, data, (queryErr, queryRes) => {
        if (queryErr) {
          console.error('Failed to insert member into Students:', queryErr);
          return res.status(500).json({
            status: 'Error',
            data: 'Failed to insert member into Students table.'
          });
        }
      });
    } else if (memberType == MEMBER_TYPE_NONSTUDENT) {
      let sql = 'INSERT INTO NonStudents (member_id, username, password) \
      VALUES ($1, $2, $3)';
      let data = [memberId, req.body.username, req.body.password];
      pool.query(sql, data, (queryErr, queryRes) => {
        if (queryErr) {
          console.error('Failed to insert member into NonStudents:', queryErr);
          return res.status(500).json({
            status: 'Error',
            data: 'Failed to insert member into NonStudents table.'
          });
        }
      });
    } else {
      console.log('Invalid member_type');
      return res.status(400).json({
        status: 'Error',
        data: `Invalid member_type in request. A valid member_type is ${MEMBER_TYPE_STUDENT} or \
        ${MEMBER_TYPE_NONSTUDENT}.`
      })
    }

    res.status(201).json({
      status: 'Success',
      data: `Successfully inserted member ${memberId}.`
    });
  });
}

function updateMember(req, res) {
  const memberId = req.params.id;

  let rem = 0, sent = false;
  for (var i in req.body) {
    rem += 1;
  }

  let done = () => {
    rem -= 1;
    if (rem == 0 && !sent) {
      sent = true;
      res.status(201).json({
        status: 'Success',
        data: `Updated member ${memberId}.`
      });
    }
  }

  for (var i in req.body) {
    if (STUDENT.indexOf(i) > -1) {
      let sql = `UPDATE Students SET ${i} = $1 WHERE id = $2`;
      pool.query(sql, [req.body[i], memberId], (queryErr, queryRes) => {
        if (queryErr) {
          console.error('Unable to update Students:', queryErr);
          if (!sent) {
            sent = true;
            res.status(500).json({
              status: 'Error',
              data: 'Unable to update the Students table.'
            });
          }
        }
        done();
      });
    } else if (NON_STUDENT.indexOf(i) > -1) {
      let sql = `UPDATE NonStudents SET ${i} = $1 WHERE id = $2`;
      pool.query(sql, [req.body[i], memberId], (queryErr, queryRes) => {
        if (queryErr) {
          console.error('Unable to update NonStudents:', queryErr);
          if (!sent) {
            sent = true;
            res.status(500).json({
              status: 'Error',
              data: 'Unable to update the NonStudents table.'
            });
          }
        }
        done();
      });
    } else {
      let sql = `UPDATE Members SET ${i} = $1 WHERE id = $2`;
      pool.query(sql, [req.body[i], memberId], (queryErr, queryRes) => {
        if (queryErr) {
          console.error('Unable to update Members:', queryErr);
          if (!sent) {
            sent = true;
            res.status(500).json({
              status: 'Error',
              data: 'Unable to update the Members table.'
            });
          }
        }
        done();
      });
    }
  }
}

function removeMember(req, res) {
  const memberId = req.params.id;
  pool.query('DELETE FROM Members WHERE id = $1', [memberId], (queryErr, queryRes) => {
    if (queryErr) {
      console.error('Unable to delete member from Members:', queryErr);
      return res.status(500).json({
        status: 'Error',
        data: 'Unable to delete member from the Members table.'
      });
    }
    // Brute force deletion. For concision's sake.
    pool.query('DELETE FROM Students WHERE id = $1', [memberId], (queryErr, queryRes) => {
      if (queryErr) {
        console.error('Unable to delete member from Students:', queryErr);
        return res.status(500).json({
          status: 'Error',
          data: 'Unable to delete member from the Students table.'
        });
      }
    });
    pool.query('DELETE FROM NonStudents WHERE id = $1', [memberId], (queryErr, queryRes) => {
      if (queryErr) {
        console.error('Unable to delete member from NonStudents:', queryErr);
        return res.status(500).json({
          status: 'Error',
          data: 'Unable to delete member from the NonStudents table.'
        });
      }
    });
  });

  res.status(201).json({
    status: 'Success',
    data: `Successfully deleted member ${memberId}.`
  });
}

function getSingleMember(req, res) {
  res.status(200).json({
    status: 'Success',
    data: req.member
  });
}

function lookupMember(req, res, next) {
  const memberId = req.params.id;
  pool.query('SELECT * FROM Members WHERE id = $1', [memberId], (queryErr, queryRes) => {
    if (queryErr) {
      console.error('Could not retrieve member:', queryErr);
      return res.status(500).json({
        status: 'Error',
        data: 'Could not retrieve member.'
      });
    }

    if (queryRes.rowCount == 0) {
      console.error(`No matching member with id ${memberId} in database:`, queryErr);
      return res.status(404).json({
        status: 'Error',
        data: 'No member found.'
      });
    }

    const member = queryRes.rows[0];

    if (member.member_type == MEMBER_TYPE_STUDENT) {
      pool.query('SELECT * FROM Students WHERE member_id = $1', [memberId], (queryErr, queryRes) => {
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
      pool.query('SELECT * FROM NonStudents WHERE member_id = $1', [memberId], (queryErr, queryRes) => {
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