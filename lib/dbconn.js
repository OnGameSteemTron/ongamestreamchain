var mysql        = require('mysql');
var connection   = mysql.createConnection({
  supportBigNumbers: true,
  bigNumberStrings: true,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB
});

module.exports = connection;
