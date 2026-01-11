const express = require("express");
const router = express.Router();
const Transactions = require('../models/Transactions');

// Create a new transaction
router.post("/transactions", async (req, res) => {
    try {
        const transaction = await Transactions.createTransaction(req.body);
        res.status(201).json({ message: "Transaction created successfully", transaction });
    } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get transaction by ID
router.get("/transactions/:id", async (req, res) => {
    try {
        const transaction = await Transactions.getTransactionById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json({ transaction });
    } catch (error) {
        console.error("Error fetching transaction:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Mock Endpoints for future logic
router.post("/transactions/refund", (req, res) => {
    res.status(200).json({ message: "Refund processed successfully (Mock)" });
});  

router.post("/transactions/:id/chargeback", (req, res) => {
    res.status(200).json({ message: "Chargeback handled successfully (Mock)", transactionId: req.params.id });
});

router.post("/transactions/:id/verify", (req, res) => {
    res.status(200).json({ message: "Transaction verified successfully (Mock)", transactionId: req.params.id });
});

module.exports = router;

