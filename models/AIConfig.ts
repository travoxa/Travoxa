import mongoose from 'mongoose';

const AIConfigSchema = new mongoose.Schema({
  apiKey: {
    type: String,
    default: "",
  },
  modelName: {
    type: String,
    default: "google/gemini-2.0-flash-lite-preview-02-05:free",
  },
  promptTemplate: {
    type: String,
    default: "You are a helpful travel assistant. Find top 5 places that match: PRIMARY_TYPE near LAT,LON."
  },
  cityPromptTemplate: {
    type: String,
    default: "Find top 10 sightseeing places in {cityName}. Return JSON array where objects have name, description, lat, lon and category."
  },
  temperature: {
    type: Number,
    default: 0.7,
  },
  maxTokens: {
    type: Number,
    default: 1000,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

// Always ensure there's at most one configuration to use as primary
// We'll manage this logic directly in the API handlers
const AIConfig = mongoose.models.AIConfig || mongoose.model('AIConfig', AIConfigSchema);

export default AIConfig;
