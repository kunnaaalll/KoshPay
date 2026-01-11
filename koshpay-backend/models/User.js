const pool = require("./db");

async function createUsersTable() {
  const queryText = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      phoneNumber VARCHAR(15) UNIQUE NOT NULL,
      fullname VARCHAR(255),
      kyc_status VARCHAR(20) DEFAULT 'PENDING',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );`;

  try {
    await pool.query(queryText);
    console.log("Users table created or already exists");
  } catch (err) {
    console.error("Error creating users table:", err);
  }
}

async function findUserByNumber(phoneNumber) {
  const res = await pool.query("SELECT * FROM users Where phonenumber = $1", [
    phoneNumber,
  ]);
  return res.rows[0] || null;
}

async function createUserByNumber(phoneNumber) {
  const res = await pool.query(
    "INSERT INTO users(phonenumber) VALUES($1) RETURNING id, phonenumber",
    [phoneNumber]
  );
  return res.rows[0];
}

async function updateUser(id, { fullname, kyc_status }) {
  const fields = [];
  const values = [];
  let query = "UPDATE users SET ";

  if (fullname) {
    fields.push(`fullname = $${fields.length + 1}`);
    values.push(fullname);
  }
  if (kyc_status) {
    fields.push(`kyc_status = $${fields.length + 1}`);
    values.push(kyc_status);
  }

  if (fields.length === 0) return null;

  query += fields.join(", ") + ` WHERE id = $${fields.length + 1} RETURNING *`;
  values.push(id);

  const res = await pool.query(query, values);
  return res.rows[0];
}

module.exports = { createUsersTable, createUserByNumber, findUserByNumber, updateUser };
