const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = { id: decoded.userID, phoneNumber: decoded.phoneNumber };
        next();
    } catch (error) {
        res.status(403).json({ error: "Invalid token" });
    }
};

module.exports = { verifyToken };
