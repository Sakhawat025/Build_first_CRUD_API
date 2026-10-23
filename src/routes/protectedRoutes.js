const express = require("express");
const router = express.Router();

// GET /protected/profile (Stage 2: unverified token check)
router.get("/profile", (req, res) => {
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "Access token required"
        });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            error: "Access token required"
        });
    }

    return res.status(200).json({
        message: "Token received"
    });
});

module.exports = router;
