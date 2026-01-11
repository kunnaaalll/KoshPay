const express = require('express');
const router = express.Router();
const { pool } = require('../models/db');
const { verifyToken } = require('../middleware/authMiddleware');
const { withdrawFromVault, getVaultAddress } = require('../blockchain/solanaService');
const { isValidUUID } = require('../models/Wallets');

// GET /api/crypto/vault-address
router.get('/vault-address', verifyToken, (req, res) => {
    res.json({ address: getVaultAddress() });
});

// POST /api/crypto/withdraw
router.post('/withdraw', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const { amount, recipientAddress, symbol } = req.body;

    if (!amount || !recipientAddress) {
        return res.status(400).json({ error: "Amount and Recipient Address required" });
    }

    if (symbol !== 'SOL') {
        return res.status(400).json({ error: "Only SOL withdrawals supported in MVP" });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Check & Lock Balance
        const walletRes = await client.query("SELECT * FROM wallets WHERE user_id = $1 FOR UPDATE", [userId]);
        if (walletRes.rows.length === 0) throw new Error("Wallet not found");
        const wallet = walletRes.rows[0];

        if (Number(wallet.balance) < Number(amount)) {
            throw new Error("Insufficient KoshPay Balance");
        }

        // 2. Perform Blockchain Transfer (Real Devnet SOL)
        // Note: This relies on your Backend Vault having SOL.
        // If fail, we rollback DB.
        console.log(`Initiating SOL withdrawal for ${userId}: ${amount} SOL to ${recipientAddress}`);
        
        let txSignature;
        try {
            txSignature = await withdrawFromVault(recipientAddress, amount);
        } catch (chainErr) {
            console.error("Blockchain Transfer Failed:", chainErr);
            throw new Error("Blockchain transfer failed. Please try again later.");
        }

        // 3. Deduct DB Balance
        const newBalance = Number(wallet.balance) - Number(amount);
        await client.query("UPDATE wallets SET balance = $1 WHERE id = $2", [newBalance, wallet.id]);

        // 4. Log Transaction
        await client.query(
            "INSERT INTO wallet_transactions(wallet_id, type, amount, reference_id, metadata) VALUES($1, $2, $3, $4, $5)",
            [wallet.id, 'WITHDRAW_CRYPTO', amount, txSignature, JSON.stringify({ recipient: recipientAddress, chain: 'SOLANA_DEVNET' })]
        );

        await client.query('COMMIT');

        res.json({
            status: "success",
            message: "Withdrawal Successful",
            txSignature: txSignature,
            newBalance: newBalance
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Crypto Withdraw Error:", error);
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
});

module.exports = router;
