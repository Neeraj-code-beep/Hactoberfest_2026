import Item from '../models/Item.js';
import { isDbConnected } from '../config/db.js';
import { gemmaService } from '../services/gemma/gemma.service.js';
import { logger } from '../utils/logger.js';

// In-memory store fallback when MongoDB is running in offline preview mode
export let fallbackItems = [
  {
    _id: 'mock-1',
    content: "Tell him about the funny discussion in class today with Neha",
    intent: 'tell_later',
    recipient: 'Neeraj',
    category: 'college',
    priority: 'normal',
    isCompleted: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    aiInterpretation: 'Tell Neeraj Later • college'
  },
  {
    _id: 'mock-2',
    content: "Ask him if he wants to visit that cozy book café this weekend",
    intent: 'tell_later',
    recipient: 'Neeraj',
    category: 'plans',
    priority: 'normal',
    isCompleted: false,
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    aiInterpretation: 'Tell Neeraj Later • plans'
  },
  {
    _id: 'mock-3',
    content: "The sunset over the campus terrace had the prettiest pastel sky today.",
    intent: 'memory',
    recipient: 'Neeraj',
    category: 'moment',
    priority: 'normal',
    isCompleted: false,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    aiInterpretation: 'Sweet Memory • moment'
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

    logger.info(`[Capture] Processing incoming thought through Gemma: "${rawInput}"`);

    // Process structured intent via real Gemma AI Service running on Ollama
    const extracted = await gemmaService.extractIntent(rawInput);

    let friendlyMessage = "Saved for later ♡";
    if (extracted.intent === 'tell_later') {
      friendlyMessage = `Saved for Neeraj ♡ I'll remind you in your next chat.`;
    } else if (extracted.intent === 'self_care') {
      friendlyMessage = `Check-in noted ♡ Take gentle care of yourself!`;
    } else if (extracted.intent === 'reminder') {
      friendlyMessage = `Reminder saved ♡ I've kept note of this.`;
    } else {
      friendlyMessage = `Kept safely in your memories ♡`;
    }

    let savedItem;

    if (isDbConnected()) {
      savedItem = await Item.create({
        content: extracted.content || rawInput,
        intent: extracted.intent,
        recipient: extracted.recipient || 'Neeraj',
        category: extracted.category || 'general',
        priority: extracted.priority || 'normal',
        aiInterpretation: `${extracted.intent === 'tell_later' ? 'Tell Neeraj' : extracted.intent} • ${extracted.category}`,
      });
    } else {
      // Local fallback store
      savedItem = {
        _id: 'item-' + Date.now(),
        content: extracted.content || rawInput,
        intent: extracted.intent,
        recipient: extracted.recipient || 'Neeraj',
        category: extracted.category || 'general',
        priority: extracted.priority || 'normal',
        isCompleted: false,
        createdAt: new Date().toISOString(),
        aiInterpretation: `${extracted.intent === 'tell_later' ? 'Tell Neeraj' : extracted.intent} • ${extracted.category}`,
      };
      fallbackItems.unshift(savedItem);
    }

    logger.info(`[Capture] Successfully categorized thought with intent "${extracted.intent}" and category "${extracted.category}"`);

    return res.status(201).json({
      success: true,
      item: savedItem,
      intent: extracted.intent,
      category: extracted.category,
      priority: extracted.priority,
      friendlyMessage,
    });
  } catch (error) {
    logger.error(`[Capture] Error processing thought: ${error.message}`);
    next(error);
  }
};
