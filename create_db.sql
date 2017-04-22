DROP DATABASE IF EXISTS sailing;
CREATE DATABASE sailing;

\c sailing;

-- Damages contains descriptions of damage to equipment.
CREATE TABLE Damages (
  id            SERIAL PRIMARY KEY,
  equipment     VARCHAR(50),
  damage        TEXT
);

-- Events contains the information for each event. Each event may be linked to many rows in the 
-- Rosters table (in the event_id field).
CREATE TABLE Events (
  id            SERIAL PRIMARY KEY,
  location      VARCHAR(50),
  start_date    DATE,       
  end_date      DATE,       
  event_name    VARCHAR(50),
  other_details TEXT -- Contains event start times for each day of the event, if necessary.
);

-- Members contains every single user in the system. Is used for general information that every 
-- user provides.
CREATE TABLE Members (
  id            SERIAL PRIMARY KEY,
  member_type   VARCHAR(20), -- Student or NonStudent.
  first_name    VARCHAR(30),
  surname       VARCHAR(30),
  email         VARCHAR(50),
  phone         VARCHAR(12)
);

-- News contains articles.
CREATE TABLE News (
  id            SERIAL PRIMARY KEY,
  creation_date DATE,
  creation_time TIME,
  edit_date     DATE,
  edit_time     TIME,
  content       TEXT,
  media_links   TEXT,
  author_id     INTEGER, -- Links to a row in the Members table.
  editor_id     INTEGER -- Links to a row in the Members table.
);

-- NonStudents is for members without an SBHS Student ID.
CREATE TABLE NonStudents (
  member_id     INTEGER PRIMARY KEY, -- Links to a row in the Members table.
  username      VARCHAR(30),
  password      TEXT
);

-- Results contains placings for each boat in each event.
CREATE TABLE Results (
  id            SERIAL PRIMARY KEY,
  race_results  INTEGER[], -- Position in each race throughout the event. E.g., [1, 4, 2, 3]
  overall       INTEGER, -- Overall placing for that event.
  roster_id     INTEGER, -- Links to a row in the Members table.
  event_id      INTEGER -- Links to a row in the Events table.
);

-- Rosters contains each boat, members, etc to be used in events (Boat Sets).
-- Each roster contains (only) one skipper and one crew.
CREATE TABLE Rosters (
  id            SERIAL PRIMARY KEY,
  boat_name     VARCHAR(50),
  sail_number   INTEGER,
  event_id      INTEGER, -- Links to a row in the Events table.
  skipper_id    INTEGER, -- Links to a row in the Members table.
  crew_id       INTEGER -- Links to a row in the Members table.
);

-- Students contains SBHS students.
CREATE TABLE Students (
  member_id     INTEGER PRIMARY KEY, -- Links to a row in the Members table.
  student_id    INTEGER -- SBHS student ID.
);





