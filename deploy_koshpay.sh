#!/bin/bash

echo "🚀 Starting KoshPay Deployment Sequence..."

# 1. Build Website
echo "\n📦 Building KoshPay Website..."
cd koshpay-website
npm install
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Website Build Successful!"
else
  echo "❌ Website Build Failed!"
  exit 1
fi

# 2. Check for APK
if [ -f "public/download/koshpay.apk" ]; then
    APK_SIZE=$(wc -c <"public/download/koshpay.apk")
    if [ $APK_SIZE -lt 1000 ]; then
        echo "\n⚠️  WARNING: koshpay.apk seems to be a placeholder (Size: $APK_SIZE bytes)."
        echo "   To build the REAL APK, run: cd ../koshpay-mobile && eas build -p android --profile preview --local"
        echo "   Then copy the output file to: koshpay-website/public/download/koshpay.apk"
        read -p "   Do you want to continue deployment with the placeholder APK? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        echo "✅ Valid APK found."
    fi
else
    echo "⚠️  No APK found in public/download/."
fi

# 3. Deploy to Vercel
echo "\n☁️  Deploying to Vercel..."
# Auto-confirm deployment if possible, else interactive
npx vercel --prod

echo "\n✨ Deployment Complete! Your KoshPay Website is live."
