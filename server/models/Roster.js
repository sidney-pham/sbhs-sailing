// Post class.
const db = require('../lib/db');
const pg = require('pg-promise');
const User = require('./User');
const moment = require('moment');

class Post {
  constructor(data) {

  }

  static get(userId, sort, past) {
    const query = 'SELECT user_level FROM Members WHERE id = $1';
    return db.one(query, [userId]).then(row => {
      const userLevel = row.user_level;
      let query = null;

      switch (sort) {
        case 'new':
        query = `SELECT * FROM Events ${past === 'hide' ? 'WHERE start_date > now()' : ''} ORDER BY start_date ASC`;
        break;
        case 'old':
        query = `SELECT * FROM Events ${past === 'hide' ? 'WHERE start_date > now()' : ''} ORDER BY start_date DESC`;
        break;
        default:
        query = `SELECT * FROM Events ${past === 'hide' ? 'WHERE start_date > now()' : ''} ORDER BY start_date ASC`;
      }

      return db.any(query).then(rosters => {
        for (const roster of rosters) {
          roster.start_date = moment(roster.start_date).format('dddd, MMMM Do YYYY');
          if (roster.end_date) {
            roster.end_date = moment(roster.end_date).format('dddd, MMMM Do YYYY');
          }
        }
        return rosters;
      }).then(rosters => {
        function getBoatFromBoatAssignment(row) {
          const boatId = row.boat_id;
          const query = 'SELECT * FROM Boats WHERE id = $1';
          return db.one(query, [boatId]);
        }

        function getBoatsFromRoster(roster) {
          // roster: {id: 11, ...}
          const eventId = roster.id;
          const query = 'SELECT * FROM Boat_Assignment WHERE event_id = $1';
          return db.any(query, [eventId]).then(rows => {
            return Promise.all(rows.map(row => getBoatFromBoatAssignment(row)));
          });
          // Output: [{id: 1, boat_name: 'a', ...}]
        }

        return Promise.all(rosters.map(roster => {
          return getBoatsFromRoster(roster).then(boats => {
            roster.boats = boats;
            return roster;
          });
        })).then(rosters => {
          return {data: rosters, user_level: userLevel};
        });
      });
    });
  }

  static add(roster) {
    console.log('Adding roster:', roster);
    // Verify dates are valid.
    if (!moment(roster.start_date).isValid()) {
      return Promise.reject(new Error('start_date is invalid.'));
    }

    if (roster.end_date && !moment(roster.end_date).isValid()) {
      return Promise.reject(new Error('end_date is invalid.'));
    }

    roster.end_date = roster.end_date || null;

    // Add event
    let eventId;
    const query = 'INSERT INTO Events (location, start_date, end_date, event_name, other_details) \
    VALUES ($1, $2, $3, $4, $5) RETURNING *';
    return db.one(query, [roster.location, roster.start_date, roster.end_date, roster.name, roster.details]).then(data => {
      eventId = data.id;
      // Add boats
      function addBoat(boat) {
        const query = 'INSERT INTO Boats (skipper, crew, boat_name, sail_number) \
        VALUES ($1, $2, $3, $4) RETURNING *';
        return db.one(query, [boat.skipper, boat.crew, boat.boat, boat.sail_number]);
      }
      return Promise.all(roster.boats.map(boat => addBoat(boat)));
    }).then(data => {
      function addBoatAssignment(boat) {
        const boatId = boat.id;
        // Add boat_assignment
        const query = 'INSERT INTO Boat_Assignment (event_id, boat_id) VALUES ($1, $2) RETURNING *';
        return db.one(query, [eventId, boatId]);
      }
      return Promise.all(data.map(boat => addBoatAssignment(boat)));
    });
  }

  static edit(id, newPost) { // TODO
    const query = 'UPDATE News SET title = $1, content = $2, md_content = $3, \
    modified_by = $4 WHERE id = $5 RETURNING *';
    return db.one(query, [newPost.title, newPost.content, marked(newPost.content), newPost.edited_by, id]);
  }

  static delete(postId, userId) {
    // Check the author. Then delete, else throw an error.
    const query = 'DELETE FROM Events WHERE id = $1 RETURNING *';
    return db.one(query, [postId]);
  }
}

module.exports = Post;
