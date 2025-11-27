const express = require("express");
const axios = require("axios");
const auth = require("../middlewares/authMiddleware");
const {
  saveFrontImageDocument,
  saveSelfieImageDocument,
  saveBackImageDocument,
  saveBasicInfo,
} = require("../models/Kyc");

const router = express.Router();

router
  .post("/kyc/nid-front", auth, async (req, res) => {
    const userId  = req.user.userID;
    const { imageUrl, doc_kind } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "Image URL is required" });
    }
    try {
      const doc = await saveFrontImageDocument(userId, doc_kind, imageUrl);
      return res.json({ message: "saved", document: doc });
    } catch (error) {
      console.error("save kyc nid-front error", error);
      return res.status(500).json({ error: "Server error" });
    }
  })
  .post("/kyc/nid-back", auth, async (req, res) => {
    const userId  = req.user.userID;
    const { imageUrl, doc_kind } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "Image URL is required" });
    }
    try {
      const doc = await saveBackImageDocument(userId, doc_kind, imageUrl);
      return res.json({ message: "saved", document: doc });
    } catch (error) {
      console.error("save kyc nid-back error", err);
      return res.status(500).json({ error: "Server error" });
    }
  })
  .post("/kyc/selfie", auth, async (req, res) => {
    const userId  = req.user.userID;
    const { imageUrl, doc_kind } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "Image URL is required" });
    }
    try {
      const doc = await saveSelfieImageDocument(userId, doc_kind, imageUrl);
      return res.json({ message: "saved", document: doc });
    } catch (error) {
      console.error("save kyc nid-back error", err);
      return res.status(500).json({ error: "Server error" });
    }
  })
  .post("/kyc/basic-info", auth, async (req, res) => {
    const userId  = req.user.userID;
    const { fullName, doc_kind, date_of_birth, address, nidNumber } = req.body;
    if (!fullName || !date_of_birth || !address || !doc_kind) {
      return res
        .status(400)
        .json({ error: "Full name, date of birth, and address are required" });
    }
    
    try {
      const doc = await saveBasicInfo(
        userId,
        fullName,
        doc_kind,
        date_of_birth,
        address,
        nidNumber
      );
      return res.json({ message: "saved", document: doc });
    } catch (error) {

      return res.status(500).json({ error: "Server error" });
    }
  });

module.exports = router;
