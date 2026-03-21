
import mongoose from 'mongoose';
import Tour from '../models/Tour';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

const verifyViews = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        // 1. Get a tour
        const tour = await Tour.findOne({});
        if (!tour) {
            console.log('No tours found.');
            return;
        }

        console.log(`Tour: ${tour.title}, Current Views: ${tour.views}`);

        // 2. Simulate view increment (manually calling findByIdAndUpdate as our API/Page does)
        const updatedTour = await Tour.findByIdAndUpdate(
            tour._id,
            { $inc: { views: 1 } },
            { new: true }
        );

        console.log(`Tour after "view": ${updatedTour?.title}, New Views: ${updatedTour?.views}`);

        if (updatedTour && updatedTour.views > tour.views) {
            console.log('✅ View increment verified!');
        } else {
            console.log('❌ View increment failed.');
        }

    } catch (error) {
        console.error('Verification failed:', error);
    } finally {
        await mongoose.disconnect();
    }
};

verifyViews();
