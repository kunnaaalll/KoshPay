const express = require("express");
const axios = require("axios");
require("dotenv").config();
const { createUserByNumber, findUserByNumber, updateUser } = require("../models/User");
const { createWalletForUser } = require("../models/Wallets");
const jwtSecret = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const router = express.Router();

router
  .post("/send-otp", async (req, res) => {
    // ... (unchanged)
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    try {
      const response = await axios.post(
        `https://verify.twilio.com/v2/Services/${process.env.TWILIO_SERVICE_SID}/Verifications`,
        new URLSearchParams({
          To: phoneNumber,
          Channel: "sms",
        }),
        {
          auth: {
            username: process.env.TWILIO_ACCOUNT_SID,
            password: process.env.TWILIO_AUTH_TOKEN,
          },
        }
      );
      return res.status(200).json({ message: "OTP sent", data: response.data });
    } catch (error) {
      return res
        .status(500)
        .json({ error: error.response?.data || error.message });
    }
  })
  .post("/verify-otp", async (req, res) => {
    const { phoneNumber, code } = req.body;
    if (!phoneNumber || !code) {
      return res
        .status(400)
        .json({ error: "Phone number and OTP code are required" });
    }
    try {
      let isApproved = false;

      // BYPASS FOR TEST USER
      if (phoneNumber === '+19999999999' && code === '123456') {
          console.log("Using Test User Bypass");
          isApproved = true;
      } else {
          const response = await axios.post(
            `https://verify.twilio.com/v2/Services/${process.env.TWILIO_SERVICE_SID}/VerificationCheck`,
            new URLSearchParams({
              To: phoneNumber,
              Code: code,
            }),
            {
              auth: {
                username: process.env.TWILIO_ACCOUNT_SID,
                password: process.env.TWILIO_AUTH_TOKEN,
              },
            }
          );
          if (response.data.status === "approved") {
              isApproved = true;
          }
      }

      if (isApproved) {
        let user = await findUserByNumber(phoneNumber);
        if (!user) {
          user = await createUserByNumber(phoneNumber);
          // Auto-create wallet for new user
          await createWalletForUser(user.id);
          console.log(`Created new wallet for user ${user.id}`);
        }
        const payload = { userID: user.id, phoneNumber: user.phonenumber };
        const token = jwt.sign(payload, jwtSecret, { expiresIn: "365d" });
        return res.json({ token, user, message: "OTP verified successfully" });
      } else {
        return res.status(401).json({ error: "Invalid OTP" });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ error: error.response?.data || error.message });
    }
  })
  .post("/demo-login", async (req, res) => {
    const phoneNumber = '+919999999999';
    try {
        let user = await findUserByNumber(phoneNumber);
        if (!user) {
          user = await createUserByNumber(phoneNumber);
          await createWalletForUser(user.id);
          console.log(`Created new Demo User and Wallet: ${user.id}`);
        }
        
        // FORCE UPDATE Name and KYC
        user = await updateUser(user.id, { 
            fullname: 'Demo User', 
            kyc_status: 'APPROVED' 
        });
        
        const payload = { userID: user.id, phoneNumber: user.phonenumber };
        const token = jwt.sign(payload, jwtSecret, { expiresIn: "365d" });
        
        return res.json({ token, user, message: "Demo Login Successful" });
    } catch (error) {
        console.error("Demo login error:", error);
        return res.status(500).json({ error: "Server error" });
    }
  });

module.exports = router;
