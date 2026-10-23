// AI-generated implementation of the Auth API (Quarantined in ai-version/)
const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

const app = express();
app.use(express.json());

// AI blindly created client without placeholder fallbacks
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// Naive AI Auth Middleware:
// Flaw 1: Token extraction assumes exactly "Bearer <token>" and crashes or fails if header is bare token
// Flaw 2: Doesn't check if error exists from getUser; only checks if user object is truthy
// Flaw 3: Inadvertently logs the token to console
const authGuard = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "No token provided" });
    }
    // Naive split: if "Authorization: token123" without Bearer, split(" ")[1] is undefined
    const parts = authHeader.split(" ");
    const token = parts[1];
    
    console.log("DEBUG: Token received:", token); // Security flaw: token leakage in server logs

    try {
        const { data, error } = await supabase.auth.getUser(token);
        if (error) {
            return res.status(401).json({ error: "Invalid token" });
        }
        req.user = data.user;
        next();
    } catch (e) {
        return res.status(500).json({ error: e.message }); // Flaw: leaks internal 500 instead of 401
    }
};

// 1. Signup
app.post("/auth/signup", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Missing fields" });
    }
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    return res.status(201).json(data.user);
});

// 2. Login
app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Missing fields" });
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        return res.status(401).json({ error: error.message });
    }
    return res.status(200).json({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token
    });
});

// 3. Logout
app.post("/auth/logout", authGuard, async (req, res) => {
    await supabase.auth.signOut();
    return res.status(204).send();
});

// 4. Public Info
app.get("/public/info", (req, res) => {
    return res.status(200).json({ message: "Welcome stranger! This info is public." });
});

// 5. Protected Profile
app.get("/protected/profile", authGuard, (req, res) => {
    return res.status(200).json({
        id: req.user.id,
        email: req.user.email,
        created_at: req.user.created_at
    });
});

module.exports = app;
