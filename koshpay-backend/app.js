const express = require("express");
const { initDb } = require('./models/initDb');
require("dotenv").config();
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const jwtSecret = process.env.JWT_SECRET;

const app = express();
const PORT = process.env.PORT;

//middlewares
app.use(cors());
app.use(express.json());

//routes
app.use('/auth', authRoutes);


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
