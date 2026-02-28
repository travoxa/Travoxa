import mongoose from 'mongoose';

const SightseeingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a package title'],
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
    duration: {
        type: String,
        required: [true, 'Please provide a duration'],
    },
    maxPeople: {
        type: Number,
        required: [true, 'Please provide max people'],
    },
    vehicleType: {
        type: String,
        enum: ['4 Seater (Sedan)', '6 Seater (SUV)', '12 Seater (Tempo Traveller)', '20 Seater (Mini Bus)'],
        required: [true, 'Please provide a vehicle type'],
    },
    highlights: {
        type: [String],
        default: [],
    },
    placesCovered: {
        type: [String],
        default: [],
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
    },
    pricePrivate: {
        type: Number,
    },
    priceSharing: {
        type: Number,
    },
    priceType: {
        type: String,
        enum: ['per_vehicle', 'per_person'],
        required: [true, 'Please provide a price type'],
    },
    overview: {
        type: String,
        required: [true, 'Please provide an overview'],
    },
    itinerary: [{
        time: String,
        title: String,
        description: String,
    }],
    inclusions: {
        type: [String],
        default: [],
    },
    exclusions: {
        type: [String],
        default: [],
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
    isPrivate: {
        type: Boolean,
        default: true,
    },
    isSharing: {
        type: Boolean,
        default: false,
    },
    pickupPoints: {
        type: [String],
        default: [],
    },
    fuelIncluded: {
        type: Boolean,
        default: true,
    },
    driverIncluded: {
        type: Boolean,
        default: true,
    },
    customizablePickup: {
        type: Boolean,
        default: false,
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'approved'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Sightseeing || mongoose.model('Sightseeing', SightseeingSchema);
