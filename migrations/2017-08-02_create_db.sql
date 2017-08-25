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
  id            SERIAL PRIMARY KEY,
  creation_date DATE,
  creation_time TIME,
  edit_date     DATE,
  edit_time     TIME,
  title         TEXT,
  content       TEXT,
  media_links   TEXT,
  author_id     INTEGER, -- Links to a row in the Members table.
  editor_id     INTEGER -- Links to a row in the Members table.
);
