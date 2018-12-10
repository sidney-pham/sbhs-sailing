# sbhs-sailing

A portal for the SBHS Sailing Program.

## Install
1. Clone this repo.
2. Make sure you have `node@8` installed.
3. Set up PostgreSQL. Use [Postgres.app](https://postgresapp.com) and create a database by running `CREATE DATABASE sailing;` from a `psql` instance. Then run `psql -f db.sql -d sailing` from `server/` to create tables in your new `sailing` database.
4. Configure setup by renaming `config_example.js` to `config.js` and filling it in.
5. `npm run serve` to run the server.
6. `npm start` to run the client.