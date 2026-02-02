import mongoose from 'mongoose';

const TourSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a tour title'],
        maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    location: {
        type: String,
        required: [true, 'Please provide a location'],
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
    },
    duration: {
        type: String,
        required: [true, 'Please provide a duration'],
    },
    availabilityDate: {
        type: String, // Can be "Flexible" or specific date range
        required: [true, 'Please provide availability dates'],
    },
    minPeople: {
        type: Number,
        required: [true, 'Please provide min people'],
    },
    maxPeople: {
        type: Number,
        required: [true, 'Please provide max people'],
    },
    rating: {
        type: Number,
        default: 0,
    },
    reviews: {
        type: Number,
        default: 0,
    },
    image: {
        type: [String], // Array of image URLs
        required: [true, 'Please provide at least one image'],
    },
    overview: {
        type: String,
        required: [true, 'Please provide an overview'],
    },
    itinerary: [{
        day: Number,
        title: String,
        description: String,
        stay: String,
        activity: String,
        meal: String,
        transfer: String,
    }],
    locationMapLink: {
        type: String,
    },
    pickupLocation: {
        type: String,
    },
    pickupMapLink: {
        type: String,
    },
    dropLocation: {
        type: String,
    },
    dropMapLink: {
        type: String,
    },
    partners: [{
        name: String,
        isVerified: {
            type: Boolean,
            default: false
        }
    }],
    highlights: [String],
    cancellationPolicy: [String],
    brochureUrl: {
        type: String,
    },
    totalSlots: {
        type: Number,
    },
    bookedSlots: {
        type: Number,
        default: 0,
    },
    bookingAmount: {
        type: Number, // Partial payment amount
    },
    earlyBirdDiscount: {
        type: Number, // Percentage
    },
    inclusions: [String],
    exclusions: [String],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Tour || mongoose.model('Tour', TourSchema);
