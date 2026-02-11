import mongoose from 'mongoose';

const AttractionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide an attraction title'],
        maxlength: [150, 'Title cannot be more than 150 characters'],
    },
    city: {
        type: String,
        required: [true, 'Please provide a city'],
    },
    state: {
        type: String,
        required: [true, 'Please provide a state'],
    },
    visitDuration: {
        type: String,
        required: [true, 'Please provide a visit duration (e.g. 2-3 hours)'],
    },
    entryFee: {
        type: Number,
        required: [true, 'Please provide an entry fee (0 for free)'],
    },
    overview: {
        type: String,
        required: [true, 'Please provide an overview'],
    },
    highlights: {
        type: [String],
        default: [],
    },
    openingHours: {
        type: String,
        required: [true, 'Please provide opening hours'],
    },
    bestTime: {
        type: String, // Best time to visit e.g. "Morning", "Evening", "Oct-Mar"
        required: false
    },
    image: {
        type: String,
        required: [true, 'Please provide an image'],
    },
    rating: {
        type: Number,
        default: 0,
    },
    reviews: {
        type: Number,
        default: 0,
    },
    category: {
        type: String, // e.g., Historical, Modern
        required: [true, 'Please provide a category'],
    },
    type: {
        type: String, // e.g., Palace, Museum
        required: [true, 'Please provide a type'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Attraction || mongoose.model('Attraction', AttractionSchema);
