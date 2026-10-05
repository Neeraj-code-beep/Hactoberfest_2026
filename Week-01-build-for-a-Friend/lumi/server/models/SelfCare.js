import mongoose from 'mongoose';

const SelfCareSchema = new mongoose.Schema(
  {
    date: {
      type: String, // YYYY-MM-DD
      required: true,
      unique: true,
    },
    meals: {
      breakfast: { type: Boolean, default: false },
      lunch: { type: Boolean, default: false },
      dinner: { type: Boolean, default: false },
    },
    waterGlasses: {
      type: Number,
      default: 0,
      min: 0,
      max: 20,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.SelfCare || mongoose.model('SelfCare', SelfCareSchema);
