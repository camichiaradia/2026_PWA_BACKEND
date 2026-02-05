
import dotenv from 'dotenv';
dotenv.config();

const API_URL = 'http://localhost:8080/api/workspace'; // Need an endpoint that exists
const API_KEY = process.env.API_KEY;

async function testApiKey() {
    console.log("Testing API Key Middleware...");

    // Test 1: No API Key
    try {
        const res = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (res.status === 401) {
            console.log("✅ Custom test passed: No API Key returned 401");
        } else {
            console.error(`❌ Custom test failed: No API Key returned ${res.status}`);
        }
    } catch (err) {
        console.error("Test 1 Error:", err.message);
    }

    // Test 2: Invalid API Key
    try {
        const res = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'INVALID_KEY'
            }
        });
        
        if (res.status === 401) {
            console.log("✅ Custom test passed: Invalid API Key returned 401");
        } else {
            console.error(`❌ Custom test failed: Invalid API Key returned ${res.status}`);
        }
    } catch (err) {
        console.error("Test 2 Error:", err.message);
    }

    // Test 3: Valid API Key
    try {
        const res = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            }
        });
        
        if (res.status !== 401) {
            console.log(`✅ Custom test passed: Valid API Key returned ${res.status} (Not 401)`);
        } else {
            console.error(`❌ Custom test failed: Valid API Key returned 401`);
        }
    } catch (err) {
        console.error("Test 3 Error:", err.message);
    }
}

testApiKey();
