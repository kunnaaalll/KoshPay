const express = require('express');
const router = express.Router();
const { pool } = require('../models/db');
const { verifyToken } = require('../middleware/authMiddleware');
const axios = require('axios');
const { isValidUUID } = require('../models/Wallets');

const CASHFREE_ENV = process.env.CASHFREE_ENV || 'TEST';
const BASE_URL = CASHFREE_ENV === 'PROD' 
    ? 'https://payout-api.cashfree.com' 
    : 'https://payout-gamma.cashfree.com';

// Helper to get Cashfree Token
async function getCashfreeToken() {
    try {
        const response = await axios.post(
            `${BASE_URL}/payout/v1/authorize`, 
            {}, 
            {
                headers: {
                    'X-Client-Id': process.env.CASHFREE_CLIENT_ID,
                    'X-Client-Secret': process.env.CASHFREE_CLIENT_SECRET
                }
            }
        );
        if (response.data && response.data.status === 'SUCCESS') {
            return response.data.data.token;
        }
        throw new Error('Failed to authorize with Cashfree');
    } catch (error) {
        console.error('Cashfree Auth Error:', error.response?.data || error.message);
        throw new Error('Cashfree Authorization Failed');
    }
}

// POST /api/payout/upi
router.post('/upi', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const { amount, upiId, name } = req.body;

    if (!amount || !upiId || !name) {
        return res.status(400).json({ error: "Amount, UPI ID, and Name are required" });
    }

    if (!isValidUUID(userId)) {
        return res.status(400).json({ error: "Invalid User ID" });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Check Balance & Deduct (Atomic)
        const walletRes = await client.query("SELECT * FROM wallets WHERE user_id = $1 FOR UPDATE", [userId]);
        if (walletRes.rows.length === 0) {
            throw new Error("Wallet not found");
        }
        const wallet = walletRes.rows[0];

        if (Number(wallet.balance) < Number(amount)) {
            throw new Error("Insufficient balance");
        }

        const newBalance = Number(wallet.balance) - Number(amount);
        await client.query("UPDATE wallets SET balance = $1 WHERE id = $2", [newBalance, wallet.id]);

        // 2. MOCK Call Cashfree Payout (Simulated)
        // const token = await getCashfreeToken();
        const transferId = `PAYOUT-${Date.now()}`;

        // Prepare request for standard transfer mock
        console.log(`[MOCK] Initiating UPI Payout of ₹${amount} to ${upiId} (${name})`);
        
        // Simulate API latency
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock Response
        const payoutResponse = {
            data: {
                status: 'SUCCESS',
                message: 'Payout initiated successfully (MOCKED)',
                data: {
                    referenceId: `REF-${Math.floor(Math.random() * 1000000)}`
                }
            }
        };

        if (payoutResponse.data.status !== 'SUCCESS') {
            throw new Error(payoutResponse.data.message || "Payout initiation failed");
        }

        // 3. Log Success Transaction
        await client.query(
            "INSERT INTO wallet_transactions(wallet_id, type, amount, reference_id, metadata) VALUES($1, $2, $3, $4, $5)",
            [wallet.id, 'PAYOUT_UPI', amount, transferId, JSON.stringify({ upiId, name, cf_reference: payoutResponse.data.data?.referenceId, mode: 'MOCK' })]
        );

        await client.query('COMMIT');

        res.json({
            status: "success",
            message: "Payout initiated successfully (Mock Mode)",
            referenceId: payoutResponse.data.data?.referenceId,
            newBalance: newBalance
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Payout Error:", error.message, error.response?.data);
        res.status(500).json({ 
            error: error.message || "Payout failed",
            details: error.response?.data 
        });
    } finally {
        client.release();
    }
});

module.exports = router;
