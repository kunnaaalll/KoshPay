const pool = require("./db");

async function createTransactionTable() {
  const queryText = `
    CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    wallet_id UUID REFERENCES wallets(id),
    payee_info JSONB, -- recipient/merchant details
    amount_fiat NUMERIC(30, 8),
    fiat_currency VARCHAR(10),
    paid_currency VARCHAR(10), -- e.g. 'BTC', 'ETH', 'USDC'
    crypto_amount NUMERIC(30, 8),
    crypto_price NUMERIC(30, 8), -- price per crypto at tx time
    status_crypto VARCHAR(20) DEFAULT 'PENDING', -- crypto payment status
    status_transaction VARCHAR(20) DEFAULT 'PENDING', -- overall tx status
    transaction_hash VARCHAR(255), -- blockchain tx hash
    external_tx_id VARCHAR(255), -- for Paytm Cashfree/other refs
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);`;

  try {
    await pool.query(queryText);
    console.log("Transaction table created or already exists");
  } catch (err) {
    console.error("Error creating Transaction table:", err);
  }
}

async function createTransaction(data) {
    const {
        user_id,
        wallet_id,
        amount_fiat,
        fiat_currency,
        paid_currency,
        crypto_amount,
        crypto_price,
        payee_info
    } = data;

    const query = `
        INSERT INTO transactions (
            user_id, wallet_id, amount_fiat, fiat_currency, paid_currency, 
            crypto_amount, crypto_price, payee_info
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
    `;
    const values = [user_id, wallet_id, amount_fiat, fiat_currency, paid_currency, crypto_amount, crypto_price, payee_info];
    
    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (err) {
        throw err;
    }
}

async function getTransactionById(id) {
    try {
        const result = await pool.query('SELECT * FROM transactions WHERE id = $1', [id]);
        return result.rows[0];
    } catch (err) {
        throw err;
    }
}

module.exports = { createTransactionTable, createTransaction, getTransactionById };
