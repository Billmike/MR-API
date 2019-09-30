const promise = require('bluebird');
const { config } = require('dotenv');

config();

const options = {
  promiseLib: promise,
};
const pgPromise = require('pg-promise')(options);

const connectionString = process.env.DATABASE_URL;
const db = pgPromise(connectionString);

module.exports = db;
