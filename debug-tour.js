const { MongoClient, ObjectId } = require('mongodb');
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

async function inspectTour() {
    const uri = env.MONGODB_URI;
    if (!uri) {
        console.error('MONGODB_URI not found in .env.local');
        return;
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected successfully to server');
        const db = client.db('travoxa'); // Assuming db name is travoxa based on test-db.js
        const collection = db.collection('tours');

        const tourId = '698de4427721852bd3a68d7c';

        let tour;
        try {
            tour = await collection.findOne({ _id: new ObjectId(tourId) });
        } catch (e) {
            console.log("Error finding with ObjectId, trying string...");
            tour = await collection.findOne({ _id: tourId });
        }

        if (tour) {
            console.log('Tour found:', tour.title);
            console.log('locationMapLink:', tour.locationMapLink);
            console.log('pickupMapLink:', tour.pickupMapLink);
            console.log('dropMapLink:', tour.dropMapLink);
        } else {
            console.log('Tour not found with ID:', tourId);
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.close();
    }
}

inspectTour();
