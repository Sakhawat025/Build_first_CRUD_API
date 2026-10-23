const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// GET /protected/profile
router.get("/profile", authMiddleware, (req, res) => {
    return res.status(200).json({
        id: req.user.id,
        email: req.user.email,
        created_at: req.user.created_at
    });
});

// GET /protected/dashboard (Stage 4 checkpoint route demonstrating middleware reuse)
router.get("/dashboard", authMiddleware, (req, res) => {
    return res.status(200).json({
        message: "Welcome to your protected dashboard!",
        user: {
            id: req.user.id,
            email: req.user.email
        }
    });
});

// GET /protected/admin (Stretch: 403 Forbidden case - authenticated user without admin role)
router.get("/admin", authMiddleware, (req, res) => {
    const isAdmin =
        req.user.user_metadata?.role === "admin" ||
        req.user.app_metadata?.role === "admin";

    if (!isAdmin) {
        return res.status(403).json({
            error: "Forbidden: Admin privileges required"
        });
    }

    return res.status(200).json({
        message: "Welcome to the admin area!",
        user: req.user.email
    });
});

module.exports = router;
