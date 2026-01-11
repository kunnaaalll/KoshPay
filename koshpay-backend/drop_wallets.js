const pool = require("./models/db");

async function run() {
    try {
        await pool.query("DROP TABLE IF EXISTS wallet_transactions CASCADE;");
        await pool.query("DROP TABLE IF EXISTS transactions CASCADE;");
        await pool.query("DROP TABLE IF EXISTS wallets CASCADE;");
        console.log("Tables dropped.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

run();
