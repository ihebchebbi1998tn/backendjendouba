
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
const schemaPath = path.join(__dirname, "schema.sql");
console.log(`Reading schema from: ${schemaPath}`);
const sqlScript = fs.readFileSync(schemaPath, "utf8");

// Split the script by semicolons to execute each statement separately
const statements = sqlScript.split(';')
  .filter(statement => statement.trim() !== '');

// Function to execute SQL statements sequentially
const executeStatements = (statements, index = 0) => {
  if (index >= statements.length) {
    console.log("Database and tables created successfully!");
    console.log("You can now view the tables in phpMyAdmin.");
    connection.end();
    return;
  }

  const currentStatement = statements[index].trim();
  if (!currentStatement) {
    executeStatements(statements, index + 1);
    return;
  }

  console.log(`Executing statement ${index + 1}/${statements.length}`);
  
  connection.query(currentStatement + ';', (err) => {
    if (err) {
      console.error(`Error executing statement ${index + 1}:`, err);
      console.error("Statement:", currentStatement);
      connection.end();
      return;
    }
    
    executeStatements(statements, index + 1);
  });
};

// Execute statements
executeStatements(statements);