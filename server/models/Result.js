// Post class.
const db = require('../lib/db');
const pg = require('pg-promise');
const User = require('./User');
const moment = require('moment');

class Post {
  constructor(data) {

  }

  static get(userId, sort) {
    const query = 'SELECT user_level FROM Members WHERE id = $1';
    return db.one(query, [userId]).then(row => {
      const userLevel = row.user_level;
      let query = null;

      switch (sort) {
        case 'new':
          query = `SELECT * FROM Events WHERE start_date < now() ORDER BY start_date DESC`;
          break;
        case 'old':
          query = `SELECT * FROM Events WHERE start_date < now() ORDER BY start_date ASC`;
          break;
        default:
          query = `SELECT * FROM Events WHERE start_date < now() ORDER BY start_date DESC`;
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

  static getOne(userId, eventId) {
    const query = 'SELECT user_level FROM Members WHERE id = $1';
    return db.one(query, [userId]).then(row => {
      const userLevel = row.user_level;
      const query = 'SELECT * FROM Events WHERE id = $1';
      return db.one(query, eventId).then(roster => {
        roster.start_date = moment(roster.start_date).format('dddd, MMMM Do YYYY');
        if (roster.end_date) {
          roster.end_date = moment(roster.end_date).format('dddd, MMMM Do YYYY');
        }

        return roster;
      }).then(roster => {
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

        return getBoatsFromRoster(roster).then(boats => {
          roster.boats = boats;
          return {data: roster, user_level: userLevel};
        });
      });
    });
  }

  static add(boats) {
    // Add event
    const query = 'INSERT INTO Boats (race_results, overall) VALUES ($1, $2) RETURNING *';
    return Promise.all(boats.map(boat => {
      return db.one(query, [boat.race_results, boat.overall]);
    }));
  }

  static edit(id, newPost) { // TODO
    const query = 'SELECT * FROM Boat_Assignment WHERE event_id = $1';
    return db.any(query, [id]).then(rows => {
      return Promise.all(rows.map((row, i) => {
        const boatId = row.boat_id;
        const query = 'UPDATE Boats SET race_results = $1, overall = $2 WHERE id = $3 RETURNING *';
        const resultArray = newPost[i][0].split(",").map(x => parseInt(x.trim()) || null);

        // console.log([newPost.race_results, newPost.overall]);
        console.log(newPost[i][1]);
        return db.one(query, [resultArray, newPost[i][1], boatId]).then(data => {
          console.log(data);
          return data;
        });
      }));
    });
  }

  static clear(id) {
    const query = 'SELECT * FROM Boat_Assignment WHERE event_id = $1';
    return db.any(query, [id]).then(rows => {
      return Promise.all(rows.map((row, i) => {
        const boatId = row.boat_id;
        const query = 'UPDATE Boats SET race_results = $1, overall = $2 WHERE id = $3 RETURNING *';

        return db.one(query, [null, null, boatId]);
      }));
    });
  }
}

module.exports = Post;
