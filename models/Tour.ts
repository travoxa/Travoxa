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
    pricing: [{
        people: Number,
        hotelType: {
            type: String,
            enum: ['Standard', 'Premium']
        },
        rooms: Number,
        packagePrice: Number, // Total price for the group
        pricePerPerson: Number // Derived or explicit
    }],
    duration: {
        type: String,
        required: [true, 'Please provide a duration'],
    },
    availabilityDate: {
        type: String, // Can be "Flexible" or specific date range - KEEPING FOR BACKWARD COMPATIBILITY
    },
    availabilityBatches: {
        type: [{
            startDate: String,
            endDate: String,
            active: { type: Boolean, default: true }
        }],
        default: []
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
    meals: [{
        day: Number,
        breakfast: [String],
        lunch: [String],
        dinner: [String],
        snacks: [String],
        custom: [String]
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Prevent mongoose from creating a new model if it already exists
// This is needed because in development we don't want to restart the server for every change
if (mongoose.models.Tour) {
    delete mongoose.models.Tour;
}

const Tour = mongoose.models.Tour || mongoose.model('Tour', TourSchema);

export default Tour;
