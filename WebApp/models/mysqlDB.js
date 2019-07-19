var mysql = require('mysql');

var db = mysql.createConnection({
    host: 'localhost',
    user : 'root',
    password : process.env.SQL_PW,
    database : process.env.SQL_DB_NAME
});
db.connect();

module.exports = db;