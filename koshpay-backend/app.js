const express = require("express");
const { initDb } = require('./models/initDb');
require("dotenv").config();
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const kycRoutes = require('./routes/kycRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const cors = require('cors');
const jwtSecret = process.env.JWT_SECRET;

const app = express();
const PORT = process.env.PORT || 3001;

//middlewares
app.use(cors());
app.use(express.json());

//routes
app.use('/api/auth', authRoutes);
app.use('/api', kycRoutes);
app.use('/api', uploadRoutes);
app.use('/api', transactionRoutes);
app.use('/api/wallet', require('./routes/walletRoutes'));
app.use('/api/payout', require('./routes/payoutRoutes'));
app.use('/api/crypto', require('./routes/cryptoRoutes'));


//initialize database and start server
initDb()
.then(() => {
    app.get("/", (req, res) => {
      res.send("Welcome to Koshpay backend!");
    });
  })
  .catch((err) => {
    console.error("Error setting up database:", err);
    process.exit(1);
});

app.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}`);
});
