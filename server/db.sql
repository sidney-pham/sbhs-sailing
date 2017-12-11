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