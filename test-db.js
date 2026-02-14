const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Basic env parser
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim().replace(/^"(.*)"$/, '$1');
    }
});

async function testConnection() {
    const uri = env.MONGODB_URI;
    if (!uri) {
        console.error('MONGODB_URI not found in .env.local');
        return;
    }
    console.log('Testing connection to:', uri.replace(/:([^@]+)@/, ':****@'));

    const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
    });

    try {
        await client.connect();
        console.log('Connected successfully to server');
        const db = client.db(env.MONGODB_DB_NAME || 'travoxa');
        const collections = await db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));
    } catch (err) {
        console.error('Connection error:', err);
        console.log('Error Code:', err.code);
        console.log('Error Reason:', err.reason);
    } finally {
        await client.close();
    }
}

testConnection();
