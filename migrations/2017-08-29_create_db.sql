-- Members contains every single user in the system. Is used for general information that every user provides.
CREATE TABLE Members (
  id            SERIAL PRIMARY KEY,
  first_name    VARCHAR(30),
  surname       VARCHAR(30),
  email         VARCHAR(255) UNIQUE,
  phone         VARCHAR(12),
  username      VARCHAR(20) UNIQUE,
  password      VARCHAR,
  student_id    VARCHAR(30) UNIQUE,
  first_login   BOOLEAN NOT NULL DEFAULT TRUE,
  is_disabled   BOOLEAN NOT NULL DEFAULT FALSE,
  user_level    VARCHAR(10)
);

-- News contains articles.
CREATE TABLE News (
  id                  SERIAL PRIMARY KEY,
  created_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  modified_at         TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  title               TEXT,
  content             TEXT,
  md_content          TEXT,
  created_by          INTEGER REFERENCES Members ON DELETE CASCADE, -- Links to a row in the Members table.
  modified_by         INTEGER REFERENCES Members ON DELETE CASCADE-- Links to a row in the Members table.
);

-- Likes contains likes for articles.
CREATE TABLE  Likes (
  post_id      INTEGER REFERENCES News ON DELETE CASCADE,
  member_id    INTEGER REFERENCES Members ON DELETE CASCADE,
  UNIQUE (post_id, member_id)
);

-- Damages contains descriptions of damage to equipment.
CREATE TABLE Damages (
  id            SERIAL PRIMARY KEY,
  equipment     VARCHAR(50),
  damage        TEXT
);

-- Events contains the information for each event. Each event may be linked to many rows in the
-- Boats table (in the event_id field).
CREATE TABLE Events (
  id            SERIAL PRIMARY KEY,
  location      VARCHAR(50),
  start_date    TIMESTAMP WITH TIME ZONE,
  end_date      TIMESTAMP WITH TIME ZONE,
  event_name    VARCHAR(50),
  other_details TEXT -- Contains event start times for each day of the event, if necessary.
);

-- Results contains placings for each boat in each event.
CREATE TABLE Results (
  id            SERIAL PRIMARY KEY,
  race_results  INTEGER[], -- Position in each race throughout the event. E.g., [1, 4, 2, 3]
  overall       INTEGER, -- Overall placing for that event.
  boat_id       INTEGER REFERENCES Boats, -- Links to a row in the Boats table.
  event_id      INTEGER REFERENCES Events-- Links to a row in the Events table.
);

-- Boats contains each boat, members, etc to be used in events (Boat Sets).
-- Each boat contains (only) one skipper and one crew.
CREATE TABLE Boats (
  id            SERIAL PRIMARY KEY,
  boat_name     VARCHAR(50),
  sail_number   VARCHAR(50),
  skipper       VARCHAR(50),
  crew          VARCHAR(50)
  -- skipper_id    INTEGER REFERENCES Members, -- Links to a row in the Members table.
  -- crew_id       INTEGER REFERENCES Members-- Links to a row in the Members table.
);

CREATE TABLE Boat_Assignment (
  event_id      INTEGER REFERENCES Events ON DELETE CASCADE,
  boat_id       INTEGER REFERENCES Boats ON DELETE CASCADE,
  UNIQUE (event_id, boat_id)
);
