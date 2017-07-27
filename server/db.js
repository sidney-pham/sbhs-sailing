const pg = require('pg-promise')();
const db = pg('postgres://localhost:5432/sailing');

module.exports = db;
