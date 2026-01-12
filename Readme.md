# KoshPay - The Future of Crypto Payments 🚀

KoshPay is a revolutionary Fintech application that bridges the gap between traditional UPI payments and the world of Cryptocurrency. It offers a seamless, secure, and user-friendly experience for managing assets, making payments, and exploring the crypto economy.

## 🌟 Key Features & How to Use

### 1. **Secure Authentication** 🔐
   - **Phone Login**: Simple login using your mobile number.
   - **OTP Verification**: Secure 6-digit OTP verification (Demo: `123456`).
   - **KYC Integration**: Basic identity verification flow ensuring compliance.

### 2. **Custodial Crypto Wallet** 💼
   - **Multi-Asset Support**: Manage SOL, BTC, ETH, and USDC in one place.
   - **Real-Time Prices**: Live market rates powered by CoinGecko Integration.
   - **Deposit & Withdraw**: Simulate adding funds to your wallet or withdrawing to bank accounts.
   - **Usage**: Go to the **Wallet Tab** to view your portfolio breakdown and total balance in INR.

### 3. **Seamless Payments** 💸
   - **Scan & Pay**: Use the built-in QR Scanner to pay any KoshPay user or compatible endpoint.
   - **P2P Transfers**: Send money directly to friends using their phone number or contacts.
   - **Instant Transactions**: Fast and low-fee transactions on the Solana network (simulated/custodial).

### 4. **Progressive Web App (PWA) Support** 📱
   - **Cross-Platform**: Works flawlessly on iOS and Android via the browser.
   - **Zero Install**: Add to Home Screen for an app-like experience without the App Store.
   - **Usage**: Visit the web app link, tap 'Share', and select 'Add to Home Screen'.

---

## 🚀 How to Use the Deployed App

**1. Access the Landing Page:**
   - Visit our official website: [KoshPay Website](https://kosh-pay-gok3.vercel.app/) .
   - Here you can learn more about the features and vision.

**2. For Android Users:**
   - Click the **"Download APK"** button on the website.
   - Install the `koshpay.apk` on your device.
   - Login with the Demo Credentials:
     - **Phone**: `9999999999`
     - **OTP**: `123456`

**3. For iOS Users (Web App):**
   - Click **"Open Web App"** on the website.
   - You will be redirected to the PWA: [https://kosh-pay.vercel.app/](https://kosh-pay.vercel.app)
   - Tap the **Share Button** (Safari) -> **Add to Home Screen**.
   - Launch "KoshPay" from your home screen for the best experience.

---

## 🛠️ How to Run Locally

Follow these steps to set up the entire KoshPay stack (Backend, Mobile/Web App, and Website) on your local machine.

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (for Backend Database)
- Expo Go App (on your physical mobile device)

### 1. Backend Setup ⚙️
The backend powers the custodial wallet and user management.

```bash
# Navigate to backend directory
cd koshpay-backend

# Install dependencies
npm install

# Configure Environment
# Create a .env file and add your database credentials & secrets:
# DATABASE_URL="postgresql://user:password@localhost:5432/koshpay?schema=public"
# JWT_SECRET="your_secret_key"
# PORT=5000

# Start the Server
npm start
```
*Server runs at `http://localhost:5000`*

### 2. Mobile App (Expo) Setup 📱
The customer-facing mobile application.

```bash
# Navigate to mobile directory
cd koshpay-mobile

# Install dependencies
npm install

# Start the Development Server
npx expo start
```
- **Run on Android**: Press `a` in the terminal (requires Emulator).
- **Run on iOS**: Press `i` in the terminal (requires Simulator).
- **Run on Physical Device**: Scan the QR code using the **Expo Go** app.
- **Run as PWA**: Press `w` to open in the browser.

### 3. Website Setup 🌐
The marketing landing page.

```bash
# Navigate to website directory
cd koshpay-website

# Install dependencies
npm install

# Start the Development Server
npm run dev
```
*Website runs at `http://localhost:3000`*

---

## 📂 Project Structure

- **`koshpay-backend/`**: Node.js/Express server with PostgreSQL and Prisma. Handles wallet logic, transactions, and auth.
- **`koshpay-mobile/`**: React Native (Expo) application. The core product offering Wallet, Scanner, and Payments.
- **`koshpay-website/`**: Next.js landing page for user acquisition and app distribution.

---

Made with ❤️ by the KoshPay Team.
