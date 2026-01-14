
import mongoose, { Document, Schema } from "mongoose";

export interface ICustomTourRequest extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    destination: string;
    duration: string;
    groupSize: number;
    tripType: "Family" | "Friends" | "Couple" | "Solo" | "Corporate" | "Other";
    budget: "Budget" | "Standard" | "Premium" | "Luxury";
    startDate?: string;
    additionalNotes?: string;
    status: "pending" | "reviewed" | "contacted" | "closed";
    createdAt: Date;
    updatedAt: Date;
}

const customTourRequestSchema = new Schema<ICustomTourRequest>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    destination: {
        type: String,
        required: [true, "Destination is required"],
        trim: true,
    },
    duration: {
        type: String, // e.g., "5 Days"
        required: [true, "Duration is required"],
    },
    groupSize: {
        type: Number,
        required: [true, "Group size is required"],
        min: [1, "Group size must be at least 1"],
    },
    tripType: {
        type: String,
        enum: ["Family", "Friends", "Couple", "Solo", "Corporate", "Other"],
        required: true,
    },
    budget: {
        type: String,
        enum: ["Budget", "Standard", "Premium", "Luxury"],
        required: true,
    },
    startDate: {
        type: String,
    },
    additionalNotes: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: ["pending", "reviewed", "contacted", "closed"],
        default: "pending",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

customTourRequestSchema.pre("save", function () {
    this.updatedAt = new Date();
});

const CustomTourRequest = mongoose.models.CustomTourRequest || mongoose.model<ICustomTourRequest>("CustomTourRequest", customTourRequestSchema);

export default CustomTourRequest;
