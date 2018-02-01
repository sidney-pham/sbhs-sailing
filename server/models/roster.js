const db = require('../utilities/db');

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

class Roster {
  static async get(eventID) {
    const query = 'SELECT * FROM Events WHERE id = $1';
    let event = await db.one(query, [eventID]);
    event = await addBoat(event);
    console.log('Getting everything:', event);
    return event;
  }

  static async getAll(sort) {
    const query = `SELECT * FROM Events`;
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

  static async add(eventName, startDate, endDate, location, details, boats, userID) {
    // Form validation.
    if (!validateEvent(eventName, startDate, endDate, location, details, boats)) {
      return Promise.reject(new Error('Event is not valid.'));
    }

    const query = 'SELECT user_level FROM Users WHERE id = $1';
    const userLevel = await db.one(query, userID).then(row => row.user_level);
    // Only admins can add events.
    if (userLevel === 'admin') {
      endDate = endDate || null;

      // Add event.
      const query = `INSERT INTO Events (location, start_date, end_date, event_name, other_details)
      VALUES ($1, $2, $3, $4, $5) RETURNING id`;
      const eventID = await db.one(query, [location, startDate, endDate, eventName, details]).then(row => row.id);

      // Add boats and link to event.
      for (const boat of boats) {
        const {
          skipper,
          crew,
          sailNumber
        } = boat;
        const boatName = boat.boat;
        let query = `INSERT INTO Boats (boat_name, sail_number, skipper, crew) VALUES
        ($1, $2, $3, $4) RETURNING id`;
        const boatID = await db.one(query, [boatName, sailNumber, skipper, crew]).then(row => row.id);

        query = `INSERT INTO Event_Boats (event_id, boat_id) VALUES ($1, $2)`;
        await db.none(query, [eventID, boatID]);
      }

      // Return event.
      return Roster.get(eventID);
    } else {
      return Promise.reject(new Error('Only admins can add new Events.'));
    }
  }

  static async update(eventID, eventName, startDate, endDate, location, details, boats, userID) {
    // Form validation.
    if (!validateEvent(eventName, startDate, endDate, location, details, boats)) {
      return Promise.reject(new Error('Event is not valid.'));
    }

    const query = 'SELECT user_level FROM Users WHERE id = $1';
    const userLevel = await db.one(query, userID).then(row => row.user_level);
    // Only admins can add events.
    if (userLevel === 'admin') {
      endDate = endDate || null;
  
      // Update event.
      const query = `UPDATE Events SET
      location = $1,
      start_date = $2,
      end_date = $3,
      event_name = $4,
      other_details = $5
      WHERE id = $6`;
      await db.none(query, [location, startDate, endDate, eventName, details, eventID]);
  
      // Delete old boats.
      const query = `DELETE FROM Boats WHERE id IN (SELECT boat_id FROM Event_Boats
        WHERE event_id = $1)`;
      await db.none(query, [eventID]);
  
      // Add new boats and link to event.
      for (const boat of boats) {
        const {
          skipper,
          crew,
          boat,
          sailNumber
        } = boat;
        const query = `INSERT INTO Boats (boat_name, sail_number, skipper, crew) VALUES
        ($1, $2, $3, $4) RETURNING id`;
        const boatID = await db.one(query, [boat, sailNumber, skipper, crew]);
  
        const query = `INSERT INTO Event_Boats (event_id, boat_id) VALUES ($1, $2)`;
        await db.none(query, [eventID, boatID]);
      }
  
      // Return post.
      return Roster.get(eventID);
    } else {
      return Promise.reject(new Error('Only admins can update Events.'));
    }
  }

  static async delete(eventID, userID) {
    const query = 'SELECT user_level FROM Users WHERE id = $1';
    const userLevel = await db.one(query, userID).then(row => row.user_level);
    // Only admins can delete events.
    if (userLevel === 'admin') {
      const query = `DELETE FROM Boats WHERE id IN (SELECT boat_id FROM Event_Boats
        WHERE event_id = $1); DELETE FROM Events WHERE id = $1;`;
      await db.none(query, [eventID]);
  
      return eventID;
    } else {
      return Promise.reject(new Error('Only admins can add new Events.'));
    }
  }
}

const maxBoats = 20;
const maxDetailsLength = 10000;
const maxOtherLength = 1000;

function validateEvent(eventName, startDate, endDate, location, details, boats) {
  let valid = true;

  if (!eventName || !startDate || !location || !boats) {
    valid = false;
  }
  
  if (eventName.length > maxOtherLength || startDate.length > maxOtherLength ||
      endDate.length > maxOtherLength || location.length > maxOtherLength ||
      details.length > maxDetailsLength || boats.length > maxBoats) {
    valid = false;
  }

  return valid;
}

module.exports = Roster;
