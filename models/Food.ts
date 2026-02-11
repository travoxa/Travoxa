import mongoose from 'mongoose';

const FoodSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a name'],
        maxlength: [150, 'Name cannot be more than 150 characters'],
    },
    type: {
        type: String, // e.g. "Cafe", "Restaurant", "Street Food"
        required: [true, 'Please provide a type'],
    },
    cuisine: {
        type: [String],
        required: [true, 'Please provide cuisines'],
    },
    city: {
        type: String,
        required: [true, 'Please provide a city'],
    },
    state: {
        type: String,
        required: [true, 'Please provide a state'],
    },
    priceRange: {
        type: String,
        enum: ['$', '$$', '$$$', '$$$$'],
        required: [true, 'Please provide a price range'],
    },
    avgCost: {
        type: Number, // Approx cost for two
        required: [true, 'Please provide average cost for two'],
    },
    overview: {
        type: String,
        required: [true, 'Please provide an overview'],
    },
    mustTry: {
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Food || mongoose.model('Food', FoodSchema);
