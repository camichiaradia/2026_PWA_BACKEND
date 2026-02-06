
import dotenv from 'dotenv';
dotenv.config();

const API_URL = 'http://localhost:8080/api/workspace'; //Asegura que este endpoint exista
const API_KEY = process.env.API_KEY;

async function testApiKey() {
    console.log("Probando el Middleware de la API Key...");

    // Test 1: No API Key
    try {
        const res = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (res.status === 401) {
            console.log("✅ Prueba pasada: Sin API Key devolvió 401 (No autorizado)");
        } else {
            console.error(`❌ Prueba fallida: Sin API Key devolvió ${res.status}`);
        }
    } catch (err) {
        console.error("Error en Prueba 1:", err.message);
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
            console.log("✅ Prueba pasada: API Key inválida devolvió 401");
        } else {
            console.error(`❌ Prueba fallida: API Key inválida devolvió ${res.status}`);
        }
    } catch (err) {
        console.error("Error en Prueba 2:", err.message);
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
            console.log(`✅ Prueba pasada: API Key válida devolvió ${res.status} (Exitoso!)`);
        } else {
            console.error(`❌ Prueba fallida: API Key válida devolvió 401`);
        }
    } catch (err) {
        console.error("Error en Prueba 3:", err.message);
    }
}

testApiKey();
