const pool = require("./db");

async function createWalletTable() {
  const walletsQuery = `
    CREATE TABLE IF NOT EXISTS wallets (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) UNIQUE NOT NULL,
      memo_id VARCHAR(6) UNIQUE NOT NULL,
      balance DECIMAL(18, 8) DEFAULT 0,
      currency VARCHAR(10) DEFAULT 'SOL',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );`;

  const transactionsQuery = `
    CREATE TABLE IF NOT EXISTS wallet_transactions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      wallet_id UUID REFERENCES wallets(id) NOT NULL,
      type VARCHAR(20) NOT NULL, -- DEPOSIT, PAYMENT, WITHDRAWAL
      amount DECIMAL(18, 8) NOT NULL,
      reference_id VARCHAR(50) NOT NULL,
      metadata JSONB DEFAULT '{}',
      status VARCHAR(20) DEFAULT 'COMPLETED',
      created_at TIMESTAMP DEFAULT NOW()
    );`;

  try {
    await pool.query(walletsQuery);
    console.log("Wallets table created or already exists");
    await pool.query(transactionsQuery);
    console.log("Wallet Transactions table created or already exists");
  } catch (err) {
    console.error("Error creating wallet tables:", err);
  }
}


function isValidUUID(id) {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(id);
}

// Helpers

async function createWalletForUser(userId) {
  if (!isValidUUID(userId)) throw new Error("Invalid User ID");

  // Generate unique 6 digit memo
  let memoId;
  let isUnique = false;
  
  while (!isUnique) {
    memoId = Math.floor(100000 + Math.random() * 900000).toString();
    const check = await pool.query("SELECT id FROM wallets WHERE memo_id = $1", [memoId]);
    if (check.rows.length === 0) isUnique = true;
  }

  const res = await pool.query(
    "INSERT INTO wallets(user_id, memo_id) VALUES($1, $2) RETURNING *",
    [userId, memoId]
  );
  return res.rows[0];
}

async function getWalletByUserId(userId) {
  if (!isValidUUID(userId)) return null;
  const res = await pool.query("SELECT * FROM wallets WHERE user_id = $1", [userId]);
  return res.rows[0];
}

async function getWalletTransactions(walletId) {
  if (!isValidUUID(walletId)) return [];
  const res = await pool.query(
    "SELECT * FROM wallet_transactions WHERE wallet_id = $1 ORDER BY created_at DESC", 
    [walletId]
  );
  return res.rows;
}

async function depositToWallet(userId, amount) {
    if (!isValidUUID(userId)) throw new Error("Invalid User ID");
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        // 1. Get Wallet
        const walletRes = await client.query("SELECT * FROM wallets WHERE user_id = $1", [userId]);
        if (walletRes.rows.length === 0) throw new Error("Wallet not found");
        const wallet = walletRes.rows[0];

        // 2. Update Balance
        const newBalance = Number(wallet.balance) + Number(amount);
        await client.query("UPDATE wallets SET balance = $1 WHERE id = $2", [newBalance, wallet.id]);

        // 3. Log Transaction
        const depositId = `DEP-${Date.now().toString().slice(-6)}`;
        await client.query(
            "INSERT INTO wallet_transactions(wallet_id, type, amount, reference_id, metadata) VALUES($1, $2, $3, $4, $5)",
            [wallet.id, 'DEPOSIT', amount, depositId, JSON.stringify({ method: 'Simulated' })]
        );

        await client.query('COMMIT');
        return { balance: newBalance, depositId };

    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
}

async function payFromWallet(userId, amount, recipientName) {
    if (!isValidUUID(userId)) throw new Error("Invalid User ID");
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        // 1. Get Wallet (Lock row for update to prevent race conditions)
        const walletRes = await client.query("SELECT * FROM wallets WHERE user_id = $1 FOR UPDATE", [userId]);
        if (walletRes.rows.length === 0) throw new Error("Wallet not found");
        const wallet = walletRes.rows[0];

        if (Number(wallet.balance) < Number(amount)) {
            throw new Error("Insufficient balance");
        }

        // 2. Deduct Balance
        const newBalance = Number(wallet.balance) - Number(amount);
        await client.query("UPDATE wallets SET balance = $1 WHERE id = $2", [newBalance, wallet.id]);

        // 3. Log Transaction
        const txnId = `TXN-${Date.now().toString().slice(-6)}`;
        await client.query(
            "INSERT INTO wallet_transactions(wallet_id, type, amount, reference_id, metadata) VALUES($1, $2, $3, $4, $5)",
            [wallet.id, 'PAYMENT', amount, txnId, JSON.stringify({ recipient: recipientName || 'External' })]
        );

        await client.query('COMMIT');
        return { balance: newBalance, txnId };

    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
}

module.exports = { 
    createWalletTable, 
    createWalletForUser, 
    getWalletByUserId, 
    getWalletTransactions,
    depositToWallet, 
    payFromWallet 
};