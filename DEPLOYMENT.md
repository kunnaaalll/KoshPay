# 🚀 KoshPay Deployment Guide

This guide outlines the step-by-step process to deploy the entire KoshPay ecosystem.

## 📦 Components Overview

| Component | Description | Deployment Platform | Result |
|-----------|-------------|---------------------|--------|
| **1. Backend** | Node.js + PostgreSQL API | **Render.com** (Recommended) or Heroku | `https://api.koshpay.com` |
| **2. Mobile App (Web)** | PWA for iOS users | **Vercel** | `https://app.koshpay.com` |
| **3. Mobile App (APK)** | Android Application | **Expo EAS** | `koshpay.apk` file |
| **4. Website** | Landing Page & Download | **Vercel** | `https://koshpay.com` |

---

## 🛠 Step 1: Deploy Backend

The mobile app and website need the Backend to function.

1.  **Push Code**: Ensure `koshpay-backend` is pushed to GitHub.
2.  **Create Service**: Go to [Render.com](https://render.com) -> New **Web Service**.
    *   **Connect Repository**: Select your `KoshPay` (monorepo) repository.
    *   **⚠️ CRITICAL: Root Directory**: You MUST set this to `koshpay-backend`.
        *   Render needs to know to look inside this folder, not the root.
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start` (This will run `node app.js`)
3.  **Environment Variables**: Add these in Render Dashboard:
    *   `DATABASE_URL`: Your PostgreSQL connection string.
        *   **Free DB Options**:
            *   [Neon.tech](https://neon.tech) (Recommended - Easiest)
            *   [Supabase](https://supabase.com)
            *   Simply create a project on one of these, copy the "Connection String", and paste it here.
    *   `JWT_SECRET`: A secure random string.
    *   `PORT`: `3001` (or let Render assign one).
4.  **Copy URL**: Once deployed, copy your new API URL (e.g., `https://koshpay-backend.onrender.com`).

---

## 📱 Step 2: Configure Mobile App

Before building, point the mobile app to your live backend.

1.  Open `koshpay-mobile/constants/config.ts`.
2.  Replace the local IP with your **Render URL**:
    ```typescript
    export const API_URL = 'https://koshpay-backend.onrender.com/api';
    ```

---

## 🍏 Step 3: Deploy iOS App (Web PWA)

Since this is an MVP, iOS users will access KoshPay via the web (Added to Home Screen).

1.  **Navigate**: `cd koshpay-mobile`
2.  **Login**: `npx vercel login`
3.  **Deploy**:
    ```bash
    npx expo export -p web
    npx vercel dist --name koshpay-app --prod
    ```
4.  **Copy URL**: Save the Vercel URL (e.g., `https://koshpay-app.vercel.app`).

---

## 🤖 Step 4: Build Android APK

1.  **Install EAS**: `npm install -g eas-cli`
2.  **Login**: `eas login`
3.  **Build**:
    ```bash
    cd koshpay-mobile
    eas build -p android --profile preview
    ```
4.  **Download**: Wait for the build to finish and download the `.apk` file.
5.  **Move File**: Rename it to `koshpay.apk` and move it to:
    `koshpay-website/public/download/koshpay.apk`

---

## 🌐 Step 5: Deploy Website (Landing Page)

This is the main entry point where users download the APK or open the PWA.

1.  **Configure Links**:
    *   Open `koshpay-website/src/app/page.tsx`
    *   **Android**: The link `/download/koshpay.apk` works automatically if you placed the file correctly.
    *   **iOS**: Update the "Add to Home Screen" section to instruct users to visit your **PWA URL** (from Step 3) first.
2.  **Deploy**:
    ```bash
    cd koshpay-website
    npx vercel --prod
    ```

---

## ✅ You're Live!

- **Android Users**: Download the APK from your website.
- **iOS Users**: Visit the PWA URL and tap "Add to Home Screen".
