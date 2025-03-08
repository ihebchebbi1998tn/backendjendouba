
const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Create MySQL connection with character set specification
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true,
  charset: 'utf8mb4',
  collation: 'utf8mb4_unicode_ci'
});

// Read SQL schema file
const sqlScript = fs.readFileSync(path.join(__dirname, "schema.sql")).toString();

// Execute SQL to create database and tables
connection.query(sqlScript, (err) => {
  if (err) {
    console.error("Error creating database:", err);
    throw err;
  }
  console.log("Database and tables created successfully!");
  console.log("You can now view the tables in phpMyAdmin.");
  connection.end();
});