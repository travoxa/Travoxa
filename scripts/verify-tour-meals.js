const mongoose = require('mongoose');

// Load environment variables via --env-file flag when running node

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

// Define Schema
const TourSchema = new mongoose.Schema({
    title: String,
    location: String,
    price: Number,
    meals: [String],
}, { strict: false });

// Invalidate cache if exists
if (mongoose.models.Tour) {
    delete mongoose.models.Tour;
}

const Tour = mongoose.model('Tour', TourSchema);

async function verifyMeals() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const testTitle = `Test Tour Meals ${Date.now()}`;
        const testMeals = ['Breakfast', 'Lunch', 'Dinner'];

        console.log('Creating test tour with meals:', testMeals);
        const tour = await Tour.create({
            title: testTitle,
            location: 'Test Location',
            price: 100,
            meals: testMeals
        });

        console.log('Tour created with ID:', tour._id);

        // Fetch back
        const fetchedTour = await Tour.findById(tour._id);
        console.log('Fetched tour meals:', fetchedTour.meals);

        if (fetchedTour.meals && fetchedTour.meals.length === 3 && fetchedTour.meals.includes('Breakfast')) {
            console.log('SUCCESS: Meals saved correctly!');
        } else {
            console.error('FAILURE: Meals were not saved correctly.');
        }

        // Cleanup
        await Tour.findByIdAndDelete(tour._id);
        console.log('Cleanup complete');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

verifyMeals();
