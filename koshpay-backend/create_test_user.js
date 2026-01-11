const { createUserByNumber, findUserByNumber } = require('./models/User');

async function run() {
    const phone = '+19999999999';
    try {
        let user = await findUserByNumber(phone);
        if (!user) {
            console.log("Creating new user...");
            user = await createUserByNumber(phone);
        } else {
            console.log("User already exists.");
        }
        console.log("USER_ID:", user.id);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

run();
