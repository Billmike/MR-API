const promise = require('bluebird');
const { config } = require('dotenv');

config();

const options = {
  promiseLib: promise,
};
const pgPrommise = require('pg-promise')(options);

const connectionString = process.env.DATABASE_URL;
const database = pgPrommise(connectionString);
