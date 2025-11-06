const fs = require('fs');
const path = require('path');
const { pool } = require('./db');

async function initializeDatabase() {
  try {
    console.log('Initializing database...');

    // Read and execute schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    await pool.query(schema);

    console.log('Database initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Wait a bit for PostgreSQL to be ready
setTimeout(initializeDatabase, 2000);
