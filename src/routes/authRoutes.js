const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const authMiddleware = require("../middleware/authMiddleware");

// POST /auth/signup
router.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) {
            return res.status(400).json({
                error: error.message
            });
        }

        return res.status(201).json({
            message: "User registered successfully",
            user: data.user
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message || "Internal server error"
        });
    }
});

// POST /auth/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error || !data || !data.session) {
            return res.status(401).json({
                error: "Invalid login credentials"
            });
        }

        return res.status(200).json({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            user: data.user
        });
    } catch (err) {
        return res.status(401).json({
            error: "Invalid login credentials"
        });
    }
});

// POST /auth/logout (Stage 4: protected route using authMiddleware)
router.post("/logout", authMiddleware, async (req, res) => {
    try {
        await supabase.auth.signOut();
        return res.status(204).send();
    } catch (err) {
        return res.status(204).send();
    }
});

module.exports = router;
