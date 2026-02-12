import mongoose from 'mongoose';

const RentalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a rental name']
    },
    type: {
        type: String,
        required: [true, 'Please provide a type'],
        enum: ['2 Seater (Scooter)', '2 Seater (Bike)', '4 Seater (Car)', '5 Seater (Car)', '7 Seater (SUV)', '12 Seater (Tempo Traveller)'],
    },
    model: {
        type: String,
        required: [true, 'Please provide a model year']
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
        type: Number,
        required: [true, 'Please provide mileage']
    },
    seats: {
        type: Number,
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
    state: {
        type: String,
        required: [true, 'Please provide a state']
    },
    city: {
        type: String,
        required: [true, 'Please provide a city']
    },
    whatsapp: {
        type: String,
        required: [true, 'Please provide a WhatsApp number']
    },
    mapLocation: {
        type: {
            lat: Number,
            lng: Number
        },
        required: false
    },
    rentalServiceName: {
        type: String,
        required: false
    },
    // Keep location for backward compatibility (computed from state + city)
    location: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

export default mongoose.models.Rental || mongoose.model('Rental', RentalSchema);

