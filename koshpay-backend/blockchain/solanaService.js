const { Connection, Keypair, PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const bs58 = require('bs58');
const { pool } = require('../models/db');
require('dotenv').config();

// CONFIG
const SOLANA_NETWORK = 'devnet'; // or 'mainnet-beta'
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// VAULT KEYPAIR (The "Hot Wallet" Authority)
// In production, load this from a secure Secret Manager or Environment Variable
// For MVP, we generate one if not exists (ephemeral) or load from ENV
let vaultKeypair;

if (process.env.VAULT_PRIVATE_KEY) {
    try {
        const secretKey = bs58.decode(process.env.VAULT_PRIVATE_KEY);
        vaultKeypair = Keypair.fromSecretKey(secretKey);
        console.log("Vault loaded:", vaultKeypair.publicKey.toString());
    } catch (e) {
        console.error("Invalid VAULT_PRIVATE_KEY, generating new temporary vault...");
        vaultKeypair = Keypair.generate();
    }
} else {
    // console.log("No VAULT_PRIVATE_KEY found. Generating ephemeral vault for testing...");
    vaultKeypair = Keypair.generate();
    // Log secret key for developer to save it if needed
    // console.log("NEW VAULT SECRET (Save this to .env VAULT_PRIVATE_KEY):", bs58.encode(vaultKeypair.secretKey));
}

/**
 * Checks balance of a wallet on-chain
 */
async function getOnChainBalance(publicKeyStr) {
    try {
        const pubKey = new PublicKey(publicKeyStr);
        const balance = await connection.getBalance(pubKey);
        return balance / LAMPORTS_PER_SOL;
    } catch (error) {
        console.error("Error fetching balance:", error);
        return 0;
    }
}

/**
 * Sends SOL from the Vault to a recipient
 * Used for Withdrawals or Payouts
 */
async function withdrawFromVault(recipientAddress, amountSol) {
    try {
        // 1. Verify Balance
        const vaultBalance = await connection.getBalance(vaultKeypair.publicKey);
        const lamportsToSend = Math.floor(amountSol * LAMPORTS_PER_SOL);
        
        if (vaultBalance < lamportsToSend + 5000) { // Keep some for fees
            throw new Error(`Insufficient Vault Balance. Available: ${vaultBalance/LAMPORTS_PER_SOL} SOL`);
        }

        // 2. Create Transaction
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: vaultKeypair.publicKey,
                toPubkey: new PublicKey(recipientAddress),
                lamports: lamportsToSend,
            })
        );

        // 3. Sign and Send
        const signature = await connection.sendTransaction(transaction, [vaultKeypair]);
        
        // 4. Confirm
        await connection.confirmTransaction(signature, 'confirmed');
        
        return signature;

    } catch (error) {
        console.error("Withdraw Error:", error);
        throw error;
    }
}

/**
 * Generates a unique deposit address for a user.
 * For the "Hot Wallet" model, users usually deposit to the MAIN vault with a Memo (Reference).
 * Or we generate a unique keypair for them, listen for deposit, and sweep to main vault.
 * 
 * MVP APPROACH:
 * User sends to their OWN phantom wallet (Non-custodial side), 
 * OR sends to OUR Vault Address with a Memo.
 */
function getVaultAddress() {
    return vaultKeypair.publicKey.toString();
}

/**
 * Mock function to simulate listening to Smart Contract Events
 * In production, this would use `connection.onLogs` to listen for `DepositEvent` from our Rust contract.
 */
async function listenForDeposits() {
    // Placeholder for WebSocket listener
    console.log("Listening for deposits on:", vaultKeypair.publicKey.toString());
    
    /* 
    connection.onLogs(PROGRAM_ID, (logs) => {
        // Parse logs, find "DepositEvent", update DB
    });
    */
}

module.exports = {
    getOnChainBalance,
    withdrawFromVault,
    getVaultAddress,
    listenForDeposits
};
