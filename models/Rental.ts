import mongoose from 'mongoose';

const RentalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a rental name']
    },
    type: {
        type: String,
        required: [true, 'Please provide a type'],
        enum: ['Scooter', 'Bike', 'Car', 'SUV', 'Tempo Traveller']
    },
    model: {
        type: String,
        required: [true, 'Please provide a model']
    },
    rating: {
        type: Number,
        default: 0
    },
    reviews: {
        type: Number,
        default: 0
    },
    mileage: {
        type: String,
        required: [true, 'Please provide mileage']
    },
    seats: {
        type: String,
        required: [true, 'Please provide number of seats']
    },
    fuel: {
        type: String,
        required: [true, 'Please provide fuel type'],
        enum: ['Petrol', 'Diesel', 'Electric', 'CNG']
    },
    helmet: {
        type: String,
        default: 'Helmet Included'
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price']
    },
    image: {
        type: String,
        required: [true, 'Please provide an image']
    },
    verified: {
        type: Boolean,
        default: false
    },
    location: {
        type: String,
        required: [true, 'Please provide a location']
    }
}, {
    timestamps: true
});

export default mongoose.models.Rental || mongoose.model('Rental', RentalSchema);
