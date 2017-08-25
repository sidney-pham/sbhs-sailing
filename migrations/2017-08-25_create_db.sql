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
  creation_timestamp  TIMESTAMP WITH TIME ZONE,
  edit_timestamp      TIMESTAMP WITH TIME ZONE,
  title               TEXT,
  content             TEXT,
  media_links         TEXT,
  author_id           INTEGER, -- Links to a row in the Members table.
  editor_id           INTEGER -- Links to a row in the Members table.
);
