
const { createUsersTable } = require('./User');
const { createWalletTable } = require('./Wallets');
const { createTransactionTable } = require('./Transactions');

async function initDb() {
  try {
    await createUsersTable();
    await createWalletTable();
    await createTransactionTable();
    console.log("All tables created or already exist");
  } catch (err) {
    console.error("Error initializing database:", err);
    throw err;
  } 
}

module.exports = { initDb };