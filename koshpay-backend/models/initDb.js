
const { createUsersTable } = require('./User');
const { createWalletTable } = require('./Wallets');
const { createTransactionTable } = require('./Transactions');
const { createKycTable } = require('./Kyc');

async function initDb() {
  try {
    await createUsersTable();
    await createWalletTable();
    await createTransactionTable();
    await createKycTable();
    console.log("All tables created or already exist");
  } catch (err) {
    console.error("Error initializing database:", err);
    throw err;
  } 
}

module.exports = { initDb };