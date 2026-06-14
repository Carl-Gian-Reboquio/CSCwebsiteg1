const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // Update with your MySQL password
  database: "civil_service_db",
  dateStrings: true,
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;