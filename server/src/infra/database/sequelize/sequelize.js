const dotenv = require('dotenv');
dotenv.config();

const database = process.env.DB_DB;
const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host     = process.env.DB_HOST;

module.exports = {
  "development": {
    "username": username,
    "password": password,
    "database": database,
    "host":     host,
    "dialect": "postgres"
  }
}
