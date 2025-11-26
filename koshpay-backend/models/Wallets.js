const pool = require('./db');

async function createWalletTable() {
  const queryText = `
    CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    asset_type VARCHAR(10), -- 'BTC', 'ETH', 'USDC', etc.
    balance NUMERIC(30, 8) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);`;

  try {
    await pool.query(queryText);
    console.log('Wallet table created or already exists');
  } catch (err) {
    console.error('Error creating Wallet table:', err);
  }
}

module.exports = { createWalletTable };