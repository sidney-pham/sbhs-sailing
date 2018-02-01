const db = require('../utilities/db');
const Roster = require('./roster');

// Add boats for each event.
// For each event, find all 'boat_id's for that event, then get all boat data
// for boats with that boat_id.
async function addBoat(event) {
  const eventID = event.id;
  const query = `SELECT * FROM Boats WHERE id IN (SELECT boat_id FROM Event_Boats
    WHERE event_id = $1)`;
  const boats = await db.any(query, [eventID]);

  return { ...event, boats };
}

class Result {
  static async getAll(sort) {
    const query = `SELECT * FROM Events WHERE start_date < now()`;
    let events = await db.any(query);    
    events = await Promise.all(events.map(event => addBoat(event)));

    // I don't know how Array.prototype.sort() works but, this seems to work.
    events.sort((a, b) => {
      if (sort === 'earliest') {
        return a.start_date - b.start_date;
      } else {
        // sort === 'latest', probably.
        return b.start_date - a.start_date;
      }
    });
    return events;
  }

  // Update all boats given ID. Does not check which event the boat is from.
  // eventID parameter is required to return the event that the user is meant
  // to be updating.
  static async update(eventID, boats, userID) {
    console.log('Boats:', boats);
    // Form validation.
    if (!validateEvent(boats)) {
      return Promise.reject(new Error('Results are not valid.'));
    }

    const query = 'SELECT user_level FROM Users WHERE id = $1';
    const userLevel = await db.one(query, userID).then(row => row.user_level);
    // Only admins can update results.
    if (userLevel === 'admin') {
      // Update each boat.
      const boatUpdates = boats.map(boat => {
        let { raceResults } = boat;
        const { id, overall } = boat;
        // Not sure if I need to do this, but I'm coercing results to a Number.
        raceResults = raceResults.map(pos => Number(pos));

        const query = `UPDATE Boats SET
        race_results = $1,
        overall = $2
        WHERE id = $3`;
        return db.none(query, [raceResults, overall, id]);
      });
      // Run all updates at once.
      await Promise.all(boatUpdates);

      // Return the event that should contain the events that were just updated.
      return Roster.get(eventID);
    } else {
      return Promise.reject(new Error('Only admins can update Results.'));
    }
  }

  // Clear all results for boats given an Event ID.
  static async delete(eventID, userID) {
    const query = 'SELECT user_level FROM Users WHERE id = $1';
    const userLevel = await db.one(query, userID).then(row => row.user_level);
    // Only admins can clear results.
    if (userLevel === 'admin') {
      const query = `UPDATE Boats SET race_results = null, overall = null 
        WHERE id IN (SELECT boat_id FROM Event_Boats
        WHERE event_id = $1)`;
      await db.none(query, [eventID]);

      return Roster.get(eventID);
    } else {
      return Promise.reject(new Error('Only admins can clear Results.'));
    }
  }
}

function validateEvent(boats) {
  let valid = true;
  for (const { id, raceResults, overall } of boats) {
    // Check if positions are integers.
    if (raceResults && raceResults.some(isNaN)) {
      valid = false;
    }

    if (isNaN(overall)) {
      valid = false;
    }
  }
  return valid;
}

module.exports = Result;
