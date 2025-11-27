const express = require("express");
const multer = require("multer");
const path = require("path");
const auth = require("../middlewares/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router
  .post(
    "/upload/kyc-front-image",
    auth,
    upload.single("kycFrontImage"),
    (req, res) => {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const fileUrl = `http://192.168.1.45:3001/uploads/${req.file.filename}`;
      return res.json({ imageUrl: fileUrl });
    }
  )
  .post(
    "/upload/kyc-back-image",
    auth,
    upload.single("kycBackImage"),
    (req, res) => {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const fileUrl = `http://192.168.1.45:3001/uploads/${req.file.filename}`;
      return res.json({ imageUrl: fileUrl });
    }
  )
  .post(
    "/upload/kyc-selfie-image",
    auth,
    upload.single("kycSelfieImage"),
    (req, res) => {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const fileUrl = `http://192.168.1.45:3001/uploads/${req.file.filename}`;
      return res.json({ imageUrl: fileUrl });
    }
  );

module.exports = router;
