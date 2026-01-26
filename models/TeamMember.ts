import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITeamMember extends Document {
    name: string;
    role: string;
    image: string;
    createdAt: Date;
}

const TeamMemberSchema = new Schema<ITeamMember>(
    {
        name: { type: String, required: true },
        role: { type: String, required: true },
        image: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// Prevent model recompilation in Next.js development
const TeamMember: Model<ITeamMember> =
    mongoose.models.TeamMember || mongoose.model<ITeamMember>("TeamMember", TeamMemberSchema);

export default TeamMember;
