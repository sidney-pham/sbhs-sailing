// Initialise and share database.
const config = require('../config');
const pg = require('pg-promise')();

const db = pg(config.database);

module.exports = db;
