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
  likes               INTEGER DEFAULT 0,
  created_by          INTEGER REFERENCES Members ON DELETE CASCADE, -- Links to a row in the Members table.
  modified_by         INTEGER REFERENCES Members ON DELETE CASCADE-- Links to a row in the Members table.
);

-- Likes contains likes for articles.
CREATE TABLE  Likes (
  post_id      INTEGER REFERENCES News ON DELETE CASCADE,
  member_id    INTEGER REFERENCES Members ON DELETE CASCADE,
  UNIQUE (post_id, member_id)
);
