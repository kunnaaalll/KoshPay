# Welcome to KoshPay 👋

This is the full KoshPay project: a crypto-first wallet and swap platform with a React Native/Expo mobile app, Express.js backend, PostgreSQL database, and blockchain layer (BTC, ETH, Solana) designed for pooled deposits, in-app wallets, and UPI-powered on/off ramps.

## Get started

1. Install dependencies

   If using a monorepo with separate apps (for example `koshpay-mobile` and `koshpay-backend`):


2. Start the services

- Start the backend API (Express + PostgreSQL):

  ```
  cd koshpay-backend
  npm install
  npm run dev
  ```

- Start the mobile app (Expo):

  ```
  cd koshpay-mobile
  npm install
  npx expo start
  ```

Make sure your `.env` files are configured for:

- Database (PostgreSQL) URL and credentials
- Blockchain RPC endpoints / providers (BTC, ETH, Solana)
- Payment/UPI providers (for example Paytm, Cashfree)
- Any JWT/secret keys for auth and KYC providers

In the Expo CLI output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing the mobile UI by editing the files inside the **koshpay-mobile/app** directory (file-based routing), and backend logic inside **koshpay-backend/src**.

## Get a fresh project

When you want to reset only the Expo app starter code and keep the backend as-is, from `koshpay-mobile` run:

This command will move the Expo starter code to the **app-example** directory and create a blank **app** directory where you can keep building the KoshPay mobile experience on top of your existing backend and infrastructure.

For backend refactors, you can create new feature modules (for example `src/modules/wallet`, `src/modules/swap`, `src/modules/upi`) while keeping shared config in `src/config` and `src/database`.

## Learn more

To learn more about the technologies used in KoshPay, check out:

- [Expo documentation](https://docs.expo.dev/): For the React Native/Expo mobile app, routing, and API routes.  
- [Express.js guide](https://expressjs.com/): For backend routing, middleware, and API design.  
- [PostgreSQL documentation](https://www.postgresql.org/docs/): For schema design, transactions, and ACID guarantees for wallet balances.  
- [Solana docs](https://solana.com/docs) and [Ethereum docs](https://ethereum.org/developers/docs/): For blockchain integration and wallet logic.  
- UPI/payments providers like [Cashfree Docs](https://docs.cashfree.com/) and [Paytm for Business](https://business.paytm.com/): For QR/UPI flows and payouts.  

## Join the community

Join communities around the core technologies powering KoshPay.

- [Expo on GitHub](https://github.com/expo/expo): View the open source platform and contribute.  
- [Node.js & Express community](https://github.com/expressjs/express): Learn and share backend patterns.  
- [PostgreSQL community](https://www.postgresql.org/community/): Explore best practices for relational databases.  
- [Solana Developers](https://solana.com/developers) and [Ethereum Developers](https://ethereum.org/developers/): Connect with blockchain developers.  
- [Discord community for Expo](https://chat.expo.dev/): Chat with Expo users and ask questions.  
