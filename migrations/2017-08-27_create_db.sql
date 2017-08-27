-- Members contains every single user in the system. Is used for general information that every user provides.
CREATE TABLE IF NOT EXISTS Members (
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
CREATE TABLE IF NOT EXISTS News (
  id                  SERIAL PRIMARY KEY,
  created_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  modified_at         TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  title               TEXT,
  content             TEXT,
  md_content          TEXT,
  created_by          INTEGER REFERENCES Members(id), -- Links to a row in the Members table.
  modified_by         INTEGER REFERENCES Members(id)-- Links to a row in the Members table.
);
