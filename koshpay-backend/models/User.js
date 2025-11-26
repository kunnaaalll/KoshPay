const pool = require('./db');

async function createUsersTable() {
  const queryText = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255),
      kyc_status VARCHAR(20) DEFAULT 'PENDING',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );`;

  try {
    await pool.query(queryText);
    console.log('Users table created or already exists');
  } catch (err) {
    console.error('Error creating users table:', err);
  }
}

module.exports = { createUsersTable };