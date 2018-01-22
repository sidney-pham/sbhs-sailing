CREATE TYPE USER_LEVEL AS ENUM ('regular', 'admin');

CREATE TABLE Users (
  id                SERIAL PRIMARY KEY,
  first_name        VARCHAR,
  surname           VARCHAR,
  phone             VARCHAR,
  student_id        VARCHAR UNIQUE,
  user_level        USER_LEVEL NOT NULL DEFAULT 'regular',
  account_disabled  BOOLEAN NOT NULL DEFAULT FALSE,
  email             VARCHAR UNIQUE,
  password          VARCHAR
);

CREATE TABLE Posts (
  id                  SERIAL PRIMARY KEY,
  created_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  modified_at         TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  title               VARCHAR,
  content             VARCHAR,
  markdown_content    VARCHAR,
  pinned              BOOLEAN NOT NULL DEFAULT FALSE,
  created_by          INTEGER REFERENCES Users ON DELETE CASCADE,
  modified_by         INTEGER REFERENCES Users ON DELETE CASCADE
);

CREATE TABLE Likes (
  post_id      INTEGER REFERENCES Posts ON DELETE CASCADE,
  user_id    INTEGER REFERENCES Users ON DELETE CASCADE,
  UNIQUE (post_id, user_id)
);

CREATE TABLE Events (
  id            SERIAL PRIMARY KEY,
  location      VARCHAR,
  start_date    TIMESTAMP WITH TIME ZONE,
  end_date      TIMESTAMP WITH TIME ZONE,
  event_name    VARCHAR,
  other_details VARCHAR
);

CREATE TABLE Boats (
  id            SERIAL PRIMARY KEY,
  boat_name     VARCHAR,
  sail_number   VARCHAR,
  skipper       VARCHAR,
  crew          VARCHAR,
  race_results  INTEGER[], -- Position in each race throughout the event. E.g., [1, 4, 2, 3]
  overall       INTEGER -- Overall placing for that event.
);

CREATE TABLE Event_Boats (
  event_id      INTEGER REFERENCES Events ON DELETE CASCADE,
  boat_id       INTEGER REFERENCES Boats ON DELETE CASCADE,
  UNIQUE (event_id, boat_id)
);

-- I'm too lazy to do this in psql.
INSERT INTO Users (first_name, surname, student_id, user_level, email, password)
  VALUES ('Sidney', 'Pham', '433986989', 'admin', 'sidneypham@gmail.com', 'test123');