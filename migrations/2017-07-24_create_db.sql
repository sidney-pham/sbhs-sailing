CREATE DATABASE sailing;

\c sailing;

-- Members contains every single user in the system. Is used for general information that every user provides.
CREATE TABLE Members (
  id            SERIAL PRIMARY KEY,
  first_name    TEXT,
  surname       TEXT,
  email         TEXT,
  phone         TEXT,
  username      TEXT UNIQUE,
  password      TEXT,
  student_id    TEXT
);
