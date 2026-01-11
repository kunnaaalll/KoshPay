const express = require('express');
const router = express.Router();
const { 
    createWalletForUser, 
    getWalletByUserId, 
    getWalletTransactions,
    depositToWallet, 
    payFromWallet 
} = require('../models/Wallets');
const fs = require('fs');
const path = require('path');

const logError = (msg, err) => {
    const log = `${new Date().toISOString()} - ${msg}: ${err.message}\n${err.stack}\n\n`;
    fs.appendFileSync(path.join(__dirname, '../backend_error.log'), log);
};

// 1. Create Wallet
router.post('/create', async (req, res) => {
  const { userId } = req.body;
  try {
    // Check if exists
    const existing = await getWalletByUserId(userId);
    if (existing) return res.status(400).json({ message: 'Wallet already exists' });

    const wallet = await createWalletForUser(userId);
    res.status(201).json(wallet);
  } catch (err) {
    console.error(err);
    logError('Wallet Route Error', err);
    res.status(500).json({ message: err.message });
  }
});

// 2. Get Wallet Info
router.get('/:userId', async (req, res) => {
  try {
    const wallet = await getWalletByUserId(req.params.userId);
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });
    
    const transactions = await getWalletTransactions(wallet.id);
    
    res.json({ ...wallet, transactions });
  } catch (err) {
    console.error(err);
    logError('Wallet Route Error', err);
    res.status(500).json({ message: err.message });
  }
});

// 3. Deposit (Simulated)
router.post('/deposit', async (req, res) => {
  const { userId, amount } = req.body;
  try {
     const result = await depositToWallet(userId, amount);
     res.json({ message: 'Deposit successful', ...result });
  } catch (err) {
    console.error(err);
    logError('Wallet Route Error', err);
    res.status(500).json({ message: err.message });
  }
});

// 4. Pay
router.post('/pay', async (req, res) => {
  const { userId, amount, recipientName } = req.body;
  try {
    const result = await payFromWallet(userId, amount, recipientName);
    res.json({ message: 'Payment successful', ...result });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
