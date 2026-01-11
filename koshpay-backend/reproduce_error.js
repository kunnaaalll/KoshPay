const { getWalletByUserId, depositToWallet } = require('./models/Wallets');
const pool = require('./models/db');

async function run() {
    try {
        console.log("Calling getWalletByUserId with '1'...");
        const res = await getWalletByUserId('1');
        console.log("Result (should be null):", res);

        console.log("Calling depositToWallet with '1'...");
        await depositToWallet('1', 10);
    } catch (e) {
        console.log("Caught expected error:");
        console.log(e.message);
    } finally {
        pool.end();
    }
}

run();
