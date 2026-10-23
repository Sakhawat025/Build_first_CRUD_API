const assert = require("assert");
const { EventEmitter } = require("events");
const app = require("./src/app");

function testRequest(method, url, headers = {}, body = {}) {
    return new Promise((resolve) => {
        const req = new EventEmitter();
        req.method = method;
        req.url = url;
        req.headers = { "content-type": "application/json", ...headers };
        req.body = body;
        req.ip = "127.0.0.1";

        const res = {
            statusCode: 200,
            headers: {},
            status(code) {
                this.statusCode = code;
                return this;
            },
            json(data) {
                this.body = data;
                resolve(this);
            },
            send(data) {
                this.body = data;
                resolve(this);
            },
            setHeader(k, v) {
                this.headers[k] = v;
            }
        };

        app.handle(req, res);
    });
}

async function runTests() {
    console.log("--- Running Auth & Protected Routes Test Suite ---");

    // 1. Public Info -> 200
    const pub = await testRequest("GET", "/public/info");
    assert.strictEqual(pub.statusCode, 200, "GET /public/info must return 200");
    assert.strictEqual(pub.body.message, "Welcome stranger! This info is public.");
    console.log("PASS: GET /public/info returns 200 with public message");

    // 2. Signup missing fields -> 400
    const signupMissing = await testRequest("POST", "/auth/signup", {}, { email: "test@example.com" });
    assert.strictEqual(signupMissing.statusCode, 400, "POST /auth/signup missing password must return 400");
    console.log("PASS: POST /auth/signup missing password returns 400");

    // 3. Login missing fields -> 400
    const loginMissing = await testRequest("POST", "/auth/login", {}, { email: "test@example.com" });
    assert.strictEqual(loginMissing.statusCode, 400, "POST /auth/login missing password must return 400");
    console.log("PASS: POST /auth/login missing password returns 400");

    // 4. Protected profile without token -> 401
    const profNoToken = await testRequest("GET", "/protected/profile");
    assert.strictEqual(profNoToken.statusCode, 401, "GET /protected/profile without token must return 401");
    assert.strictEqual(profNoToken.body.error, "Access token required");
    console.log("PASS: GET /protected/profile without token returns 401 (Access token required)");

    // 5. Protected dashboard without token -> 401
    const dashNoToken = await testRequest("GET", "/protected/dashboard");
    assert.strictEqual(dashNoToken.statusCode, 401, "GET /protected/dashboard without token must return 401");
    console.log("PASS: GET /protected/dashboard without token returns 401");

    // 6. Protected admin without token -> 401
    const adminNoToken = await testRequest("GET", "/protected/admin");
    assert.strictEqual(adminNoToken.statusCode, 401, "GET /protected/admin without token must return 401");
    console.log("PASS: GET /protected/admin without token returns 401");

    // 7. Refresh token missing -> 400
    const refreshMissing = await testRequest("POST", "/auth/refresh", {}, {});
    assert.strictEqual(refreshMissing.statusCode, 400, "POST /auth/refresh without token must return 400");
    console.log("PASS: POST /auth/refresh missing token returns 400");

    console.log("\nAll core endpoint assertions passed successfully!");
}

runTests().catch((err) => {
    console.error("Test failed:", err);
    process.exit(1);
});
