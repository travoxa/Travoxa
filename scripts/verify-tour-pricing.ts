
import mongoose from 'mongoose';
import Tour from '../models/Tour';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

const verifyPricing = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        const dummyPricing = [
            { people: 2, hotelType: 'Standard', rooms: 1, packagePrice: 10000, pricePerPerson: 5000 },
            { people: 4, hotelType: 'Premium', rooms: 2, packagePrice: 25000, pricePerPerson: 6250 }
        ];

        console.log('Creating dummy tour with pricing...');
        const tour = await Tour.create({
            title: 'Pricing Test Tour',
            cardImage: 'https://example.com/image.jpg',
            images: ['https://example.com/image.jpg'],
            location: 'Test Location',
            duration: '3 Days',
            durationDays: '3',
            durationNights: '2',
            price: 5000, // Base price
            pricing: dummyPricing,
            overview: 'Test overview',
            inclusions: ['Test Inclusion'],
            exclusions: ['Test Exclusion'],
            highlights: ['Test Highlight'],
            itinerary: [{ day: 1, title: 'Day 1', description: 'Test', stay: 'Hotel' }],
            meals: ['Breakfast'],
            availabilityDate: 'Flexible'
        });

        console.log('Tour created with ID:', tour._id);

        console.log('Fetching tour from DB...');
        const fetchedTour = await Tour.findById(tour._id);

        if (!fetchedTour) {
            throw new Error('Fetched tour is null');
        }

        console.log('Verifying pricing data...');
        if (!fetchedTour.pricing || fetchedTour.pricing.length !== 2) {
            throw new Error('Pricing array length mismatch');
        }

        const p1 = fetchedTour.pricing.find((p: any) => p.people === 2);
        const p2 = fetchedTour.pricing.find((p: any) => p.people === 4);

        if (!p1 || p1.packagePrice !== 10000 || p1.hotelType !== 'Standard') {
            throw new Error('Pricing option 1 mismatch');
        }
        if (!p2 || p2.packagePrice !== 25000 || p2.hotelType !== 'Premium') {
            throw new Error('Pricing option 2 mismatch');
        }

        console.log('✓ Pricing data verification passed!');

        console.log('Cleaning up...');
        await Tour.findByIdAndDelete(tour._id);
        console.log('Tour deleted.');

    } catch (error) {
        console.error('Verification failed:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
};

verifyPricing();
