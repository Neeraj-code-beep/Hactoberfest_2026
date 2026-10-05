import Item from '../models/Item.js';
import { isDbConnected } from '../config/db.js';
import { gemmaService } from '../services/gemma/gemma.service.js';

// In-memory store fallback when MongoDB is running in offline preview mode
export let fallbackItems = [
  {
    _id: 'mock-1',
    content: "Tell him about the funny discussion in class today with Neha",
    intent: 'tell_later',
    recipient: 'Dheeraj',
    category: 'College',
    priority: 'normal',
    isCompleted: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    aiInterpretation: 'Tell Dheeraj Later • College'
  },
  {
    _id: 'mock-2',
    content: "Ask him if he wants to visit that cozy book café this weekend",
    intent: 'tell_later',
    recipient: 'Dheeraj',
    category: 'Plans',
    priority: 'normal',
    isCompleted: false,
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    aiInterpretation: 'Tell Dheeraj Later • Plans'
  },
  {
    _id: 'mock-3',
    content: "The sunset over the campus terrace had the prettiest pastel pink sky today.",
    intent: 'memory',
    recipient: 'Ashmita',
    category: 'Moments',
    priority: 'normal',
    isCompleted: false,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    aiInterpretation: 'Sweet Memory • Moments'
  }
];

export const captureThought = async (req, res, next) => {
  try {
    const { text, content } = req.body;
    const rawInput = (text || content || '').trim();

    if (!rawInput) {
      return res.status(400).json({
        success: false,
        message: "Please enter a thought or note to save."
      });
    }

    // Process structured intent via Gemma AI Service
    const extracted = await gemmaService.extractIntent(rawInput);

    let friendlyMessage = "Saved for later ♡";
    if (extracted.intent === 'tell_later') {
      friendlyMessage = `Saved for Dheeraj ♡ I'll remind you in your next chat.`;
    } else if (extracted.intent === 'self_care') {
      friendlyMessage = `Check-in noted ♡ Take gentle care of yourself!`;
    } else {
      friendlyMessage = `Kept safely in your memories ♡`;
    }

    let savedItem;

    if (isDbConnected()) {
      savedItem = await Item.create({
        content: rawInput,
        intent: extracted.intent,
        recipient: extracted.recipient || 'Dheeraj',
        category: extracted.category || 'General',
        priority: extracted.priority || 'normal',
        aiInterpretation: `${extracted.intent === 'tell_later' ? 'Tell Dheeraj' : 'Memory'} • ${extracted.category}`,
      });
    } else {
      // Local fallback store
      savedItem = {
        _id: 'item-' + Date.now(),
        content: rawInput,
        intent: extracted.intent,
        recipient: extracted.recipient || 'Dheeraj',
        category: extracted.category || 'General',
        priority: extracted.priority || 'normal',
        isCompleted: false,
        createdAt: new Date().toISOString(),
        aiInterpretation: `${extracted.intent === 'tell_later' ? 'Tell Dheeraj' : 'Memory'} • ${extracted.category}`,
      };
      fallbackItems.unshift(savedItem);
    }

    return res.status(201).json({
      success: true,
      item: savedItem,
      intent: extracted.intent,
      category: extracted.category,
      friendlyMessage,
    });
  } catch (error) {
    next(error);
  }
};
