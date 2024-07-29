const mysql = require('mysql2');
const config = require('config');

const pool = mysql.createPool({
    host : 'localhost',
    user : 'root', 
    database : config.get('db'),
    password : config.get('mySqlPass'),
});

module.exports = pool.promise();
