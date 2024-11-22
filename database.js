
// db.js
const mongoose = require('mongoose');
const _mysql = require('mysql2/promise')

mongoose.connect(process.env.MONGODB_URI, {})
  .then(() => {
    console.log('[MongoDB] Connected!');
  }).catch((err) => {
    console.log('[MongoDB] Connection error: ' + err)
  });

const mysql = _mysql.createPool({
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_DB,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  port: process.env.MYSQL_PORT
});

module.exports = { mysql, mongoose }
