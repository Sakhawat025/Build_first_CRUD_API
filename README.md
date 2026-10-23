# Auth · Login & Protect — Secure API with Supabase Auth & JWT Verification

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-5.x-black.svg)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E.svg)](https://supabase.com/)
[![OpenAPI/Swagger](https://img.shields.io/badge/Swagger-OpenAPI%203.0-85EA2D.svg)](http://localhost:3000/docs)

A production-grade backend API that handles user authentication (**Sign Up**, **Log In**, **Log Out**, **Token Refresh**) and guards protected routes using **Supabase Auth** as the Identity Provider (IdP), JWT verification middleware, and interactive **Swagger UI** with Bearer authorization.

---

## 1. The Big Idea: The Trust Triangle

Secure authentication is a trust triangle between three parties: the **Client**, your **Backend Server**, and the **Identity Provider (Supabase)**.

```
       +---------------------------------------------+
       |             Identity Provider               |
       |                (Supabase)                   |
       +---------------------------------------------+
              ^                               ^
   1. Sign Up | 2. Returns JWT     4. Verify  | 5. Token Valid +
      & Login |    Access Token       Token   |    User Metadata
              v                               v
       +-------------+  3. Request + JWT  +-------------+
       |   Client    | -----------------> | Your Server |
       | (Browser/   |   Authorization:   |  (Express)  |
       |  Frontend)  |   Bearer <token>   +-------------+
       +-------------+
```

1. **Sign Up & Log In**: The client sends credentials (`email` + `password`) to your backend, which forwards them safely to Supabase.
2. **Token Issuance**: Supabase cryptographically signs and returns an **access token (JWT)** and a **refresh token**. Passwords are never stored on your server.
3. **The Request**: The client calls protected endpoints, attaching the JWT in the `Authorization: Bearer <token>` header.
4. **Verification**: The auth middleware on your server verifies the token with Supabase (`supabase.auth.getUser(token)`). If valid, user metadata is attached to `req.user` and the door opens.

---

## 2. API Endpoints Reference

| Method | Endpoint | Description | Auth Required | Status Codes |
|---|---|---|---|---|
| `POST` | `/auth/signup` | Register a new user account | None | `201 Created`, `400 Bad Request` |
| `POST` | `/auth/login` | Authenticate user & return JWT token pair | None | `200 OK`, `400 Bad Request`, `401 Unauthorized`, `429 Too Many Requests` |
| `POST` | `/auth/logout` | Invalidate session / log out | `Bearer <JWT>` | `204 No Content`, `401 Unauthorized` |
| `POST` | `/auth/refresh` | Exchange refresh token for fresh access token | None | `200 OK`, `400 Bad Request`, `401 Unauthorized` |
| `GET` | `/public/info` | Publicly accessible information | None | `200 OK` |
| `GET` | `/protected/profile`| Returns authenticated user's profile metadata | `Bearer <JWT>` | `200 OK`, `401 Unauthorized` |
| `GET` | `/protected/dashboard`| Secondary protected route confirming middleware reuse | `Bearer <JWT>` | `200 OK`, `401 Unauthorized` |
| `GET` | `/protected/admin` | Admin-only route demonstrating authorization | `Bearer <JWT>` | `200 OK`, `401 Unauthorized`, `403 Forbidden` |
| `GET` | `/tasks` | Retrieve all tasks | None | `200 OK` |
| `POST`| `/tasks` | Create a new task | None | `201 Created`, `400 Bad Request` |
| `GET` | `/tasks/:id` | Retrieve task by ID | None | `200 OK`, `404 Not Found` |
| `PUT` | `/tasks/:id` | Update task by ID | None | `200 OK`, `404 Not Found` |
| `DELETE`| `/tasks/:id` | Delete task by ID | None | `204 No Content`, `404 Not Found` |

---

## 3. Environment Variables Setup

The application uses `dotenv` to load secrets from a local `.env` file. **The `.env` file is git-ignored and never committed to source control.**

A template file [`.env.example`](.env.example) is committed to the repository:

```env
# Supabase Configuration
# Obtain your Project URL and anon key from Supabase Dashboard -> Project Settings -> API
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-public-key

# Server Port
PORT=3000

# Optional PostgreSQL Database Connection String
DATABASE_URL=postgres://postgres:dev@localhost:5432/tasks
```

### Steps to configure Supabase:
1. Create a free account at [supabase.com](https://supabase.com) and create a project (e.g., `Auth-Practice`).
2. Go to **Project Settings** &rarr; **API**, copy your **Project URL** and **anon public key**.
3. Go to **Authentication** &rarr; **Sign In / Providers** &rarr; **Email**, and turn off **Confirm email** for local development so signups can log in immediately.
4. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
5. Populate `SUPABASE_URL` and `SUPABASE_KEY` with your project keys.

---

## 4. Installation & Quickstart

Run the server with a single command:

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start
```

When started, the terminal displays:
```
Server running on port 3000 and connected to Supabase
```

---

## 5. Testing with cURL (Stage-by-Stage Verification)

### Stage 1: Sign Up & Log In
```bash
# 1. Sign up a new user
curl -i -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@example.com","password":"securepassword123"}'
# Response: 201 Created

# 2. Attempt signup without password (Validation Check)
curl -i -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@example.com"}'
# Response: 400 Bad Request -> {"error":"Email and password are required"}

# 3. Log in to get tokens
curl -i -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@example.com","password":"securepassword123"}'
# Response: 200 OK with "access_token" and "refresh_token"
```

### Stage 2: Public vs Protected Gate
```bash
# Public route (No token needed)
curl -i http://localhost:3000/public/info
# Response: 200 OK -> {"message":"Welcome stranger! This info is public."}

# Protected route without token
curl -i http://localhost:3000/protected/profile
# Response: 401 Unauthorized -> {"error":"Access token required"}
```

### Stage 3 & 4: Token Verification & Reusable Middleware
```bash
# Replace <YOUR_TOKEN> with access_token obtained from login:
TOKEN="eyJhbGciOiJIUzI1NiIsIn..."

# Valid Token Call
curl -i http://localhost:3000/protected/profile \
  -H "Authorization: Bearer $TOKEN"
# Response: 200 OK -> returns { id, email, created_at }

# Second Protected Route (demonstrating middleware reuse)
curl -i http://localhost:3000/protected/dashboard \
  -H "Authorization: Bearer $TOKEN"
# Response: 200 OK -> {"message":"Welcome to your protected dashboard!", ...}

# Tampered / Forged Token Call
curl -i http://localhost:3000/protected/profile \
  -H "Authorization: Bearer ${TOKEN}tampered"
# Response: 401 Unauthorized -> {"error":"Invalid or expired token"}

# Log Out
curl -i -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer $TOKEN"
# Response: 204 No Content
```

---

## 6. Swagger UI & Interactive Documentation

Interactive API documentation with Swagger UI is hosted at:
**[http://localhost:3000/docs](http://localhost:3000/docs)**

### Bearer Token Padlock in Swagger
1. Navigate to `http://localhost:3000/docs` in your browser.
2. Click the green **Authorize** button at the top right.
3. Paste your JWT string into the value box (`Bearer <token>` is automatically formatted).
4. All protected endpoints (`/protected/profile`, `/protected/dashboard`, `/protected/admin`, `/auth/logout`) now display a locked padlock.
5. Click **Try it out** &rarr; **Execute** on `GET /protected/profile` to test directly from the browser.

---

## 7. Deep Dive: Security Concepts & Extras

### 401 Unauthorized vs 403 Forbidden
- **401 Unauthorized**: *"Who are you?"* The request lacks valid authentication credentials. Either no token was sent, or the token was invalid/expired.
- **403 Forbidden**: *"I know who you are, but you are not allowed in."* The user is properly authenticated, but lacks necessary roles or permissions (e.g. attempting to access `GET /protected/admin` as a standard user).

### Why Access Tokens are Short-Lived
Access tokens (JWTs) are stateless: once issued, any server verifying the cryptographic signature will accept them until expiration. If a token is intercepted or leaked, an attacker could impersonate the user indefinitely if tokens were long-lived. Keeping access tokens short-lived (e.g., 1 hour) limits the attack window. Refresh tokens, stored securely, can be revoked or exchanged for new access tokens.

### Brute-Force Rate Limiting on Login
Authentication endpoints are the primary targets of credential-stuffing and password-guessing dictionary attacks. The `/auth/login` route implements an in-memory rate-limiter allowing a maximum of 5 failed attempts per 15-minute window per IP. Exceeding this limit returns HTTP `429 Too Many Requests`.

---

## 8. Stage 7: The AI Rematch ("AI vs Me")

As part of Stage 7, an AI was prompted from memory to construct the same secured API into the quarantined folder [`ai-version/`](ai-version/).

### The Prompt Used
> *"Build an Express.js backend API using Supabase Auth as the Identity Provider. Create five endpoints: POST /auth/signup (returns 201), POST /auth/login (returns 200 with access_token), POST /auth/logout (returns 204), GET /public/info (returns 200), and GET /protected/profile (returns 200 with user id, email, created_at). Implement an auth middleware that extracts the Bearer token from the Authorization header and verifies it via supabase.auth.getUser(token). Return 400 for missing input and 401 for missing, malformed, or invalid tokens. Configure Swagger UI with bearer authentication."*

### Three Concrete Differences & Code Review

1. **Token Extraction Fragility**:
   - *AI Version*: Used `req.headers.authorization.split(" ")[1]`. If the client sent a raw token without the `Bearer ` prefix (e.g. `Authorization: eyJhbG...`), `split(" ")[1]` was `undefined`, causing unpredictable behavior.
   - *Our Implementation*: Rigorously validates `authHeader.startsWith("Bearer ")` before splitting, rejecting malformed headers immediately with a clean `401 Unauthorized`.

2. **Security Flaw & Token Leakage**:
   - *AI Version*: Included `console.log("DEBUG: Token received:", token);` inside the middleware and allowed unhandled errors in `getUser` to bubble up into HTTP 500 responses leaking internal error traces.
   - *Our Implementation*: Never logs JWTs or secrets to terminal logs, preventing sensitive token leakage, and consistently translates verification failures to `401 {"error": "Invalid or expired token"}`.

3. **Silent Assumptions & Edge Cases**:
   - *AI Version*: Assumed `createClient(process.env.SUPABASE_URL, ...)` would never run without a valid `.env` file, crashing the server process instantly on startup if environment variables were missing.
   - *Our Implementation*: Employs fallback placeholders so the server can boot and document endpoints even before configuration, and verifies `data.session` existence on login before reading tokens.

---

## 9. Git History Verification

The project strictly follows the assignment progression with one clean commit per stage:

```text
c61f424 Stage 7: AI vs me (AI code stays in its own folder/branch)
b41888b Extras: 403 forbidden route, token refresh, and login rate limiting
6737a66 Stage 5: Swagger UI documentation with bearer auth
509568b Stage 4: auth middleware and logout endpoint
8a6bb59 Stage 3: profile route token verification
25b2897 Stage 2: public route and unverified protected route
3b8fc72 Stage 1: signup and login routes working
3769ed6 setup server and supabase client
```
