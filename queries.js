const promise = require('bluebird');

const options = {
  promiseLib: promise,
};
const pgPrommise = require('pg-promise')(options);

const connectionString = 'postgres://localhost:5432/mrapi';
const database = pgPrommise(connectionString);
