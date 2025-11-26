const express = require("express");
const axios = require("axios");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const router = express.Router();

router
  .post("/send-otp", async (req, res) => {
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

        // const user = await getUserByPhoneNumber(phoneNumber);
        // if (!user) {
        //   const newUser = await createUser(phoneNumber);
        //   user = newUser;
        // } else {
        //   user.lastLogin = new Date();
        //   await updateUser(user);
        // }

        // const payload = {userID: user._id, phoneNumber: user.phoneNumber};
        // const token = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });
        // return res.json({ token, user, message: "OTP verified successfully" });
        return res.status(200).json({ message: "OTP verified successfully" });

      } else {
        return res.status(401).json({ error: "Invalid OTP" });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ error: error.response?.data || error.message });
    }
  });

  module.exports = router;