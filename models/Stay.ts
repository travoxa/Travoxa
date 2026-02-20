import mongoose from 'mongoose';

const StaySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a stay title'],
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
    location: {
        type: String,
        required: [true, 'Please provide a specific location'],
    },
    type: {
        type: String,
        enum: ['Hotel', 'Resort', 'Homestay', 'Villa', 'Apartment', 'Hostel', 'Campsite'],
        required: [true, 'Please provide a stay type'],
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
    },
    priceType: {
        type: String,
        enum: ['per_night', 'per_person'],
        default: 'per_night',
    },
    rating: {
        type: Number,
        default: 0,
    },
    reviews: {
        type: Number,
        default: 0,
    },
    overview: {
        type: String,
        required: [true, 'Please provide an overview'],
    },
    amenities: {
        type: [String],
        default: [],
    },
    images: {
        type: [String],
        default: [],
    },
    coverImage: {
        type: String,
        required: [true, 'Please provide a cover image'],
    },
    contactPhone: {
        type: String,
    },
    contactEmail: {
        type: String,
    },
    checkInTime: {
        type: String,
        default: '12:00 PM',
    },
    checkOutTime: {
        type: String,
        default: '11:00 AM',
    },
    maxGuests: {
        type: Number,
    },
    bedrooms: {
        type: Number,
    },
    bathrooms: {
        type: Number,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Stay || mongoose.model('Stay', StaySchema);
