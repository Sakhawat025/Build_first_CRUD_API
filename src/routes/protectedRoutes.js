const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

// GET /protected/profile (Stage 3: profile route token verification)
router.get("/profile", async (req, res) => {
    try {
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

        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data || !data.user) {
            return res.status(401).json({
                error: "Invalid or expired token"
            });
        }

        const user = data.user;
        return res.status(200).json({
            id: user.id,
            email: user.email,
            created_at: user.created_at
        });
    } catch (err) {
        return res.status(401).json({
            error: "Invalid or expired token"
        });
    }
});

module.exports = router;
