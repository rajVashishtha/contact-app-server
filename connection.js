const mysql = require('mysql')

const mysqlConnection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:"",
    database:"contacts_app",
    multipleStatements: true
});

module.exports = mysqlConnection