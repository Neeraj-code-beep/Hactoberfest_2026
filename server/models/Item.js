import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Thought content is required'],
      trim: true,
    },
    intent: {
      type: String,
      enum: ['tell_later', 'memory', 'self_care', 'reminder', 'note'],
      default: 'memory',
    },
    recipient: {
      type: String,
      default: 'Neeraj',
    },
    category: {
      type: String,
      default: 'general',
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high'],
      default: 'normal',
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    aiInterpretation: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Item || mongoose.model('Item', ItemSchema);
