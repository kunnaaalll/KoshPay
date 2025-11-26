const pool = require("./db");

async function createPayoutsTable() {
  const queryText = `
    CREATE TABLE IF NOT EXISTS payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES transactions(id),
    payout_status VARCHAR(20),
    payout_response JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);`;

  try {
    await pool.query(queryText);
    console.log("Payout table created or already exists");
  } catch (err) {
    console.error("Error creating Payout table:", err);
  }
}

module.exports = { createPayoutsTable };
