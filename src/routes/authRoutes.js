const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const authMiddleware = require("../middleware/authMiddleware");

// In-memory brute-force rate limiter for /auth/login
// Tracks failed attempts per IP within a time window
const loginAttempts = new Map();
const MAX_FAILED_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function rateLimitLogin(req, res, next) {
    const ip = req.ip || req.connection?.remoteAddress || "default-ip";
    const now = Date.now();
    const record = loginAttempts.get(ip);

    if (record) {
        if (now - record.startTime > WINDOW_MS) {
            // Window reset
            loginAttempts.delete(ip);
        } else if (record.count >= MAX_FAILED_ATTEMPTS) {
            return res.status(429).json({
                error: "Too many failed login attempts. Please try again later."
            });
        }
    }
    next();
}

function recordFailedLogin(ip) {
    const now = Date.now();
    const record = loginAttempts.get(ip) || { count: 0, startTime: now };
    if (now - record.startTime > WINDOW_MS) {
        loginAttempts.set(ip, { count: 1, startTime: now });
    } else {
        record.count += 1;
        loginAttempts.set(ip, record);
    }
}

function resetFailedLogin(ip) {
    loginAttempts.delete(ip);
}

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

// POST /auth/login (with brute-force rate limiter)
router.post("/login", rateLimitLogin, async (req, res) => {
    const ip = req.ip || req.connection?.remoteAddress || "default-ip";
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
            recordFailedLogin(ip);
            return res.status(401).json({
                error: "Invalid login credentials"
            });
        }

        resetFailedLogin(ip);
        return res.status(200).json({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            user: data.user
        });
    } catch (err) {
        recordFailedLogin(ip);
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

// POST /auth/refresh (Stretch: Refresh token flow)
router.post("/refresh", async (req, res) => {
    try {
        const { refresh_token } = req.body || {};

        if (!refresh_token) {
            return res.status(400).json({
                error: "refresh_token is required"
            });
        }

        const { data, error } = await supabase.auth.refreshSession({
            refresh_token
        });

        if (error || !data || !data.session) {
            return res.status(401).json({
                error: "Invalid or expired refresh token"
            });
        }

        return res.status(200).json({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            user: data.user
        });
    } catch (err) {
        return res.status(401).json({
            error: "Invalid or expired refresh token"
        });
    }
});

module.exports = router;
