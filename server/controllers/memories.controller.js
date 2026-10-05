import Item from '../models/Item.js';
import { isDbConnected } from '../config/db.js';
import { fallbackItems } from './capture.controller.js';

/**
 * Get memories timeline
 */
export const getMemories = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const items = await Item.find({
        intent: { $in: ['memory', 'note'] },
      }).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: items.length,
        memories: items,
      });
    }

    const memories = fallbackItems.filter((i) => i.intent === 'memory' || i.intent === 'note');
    return res.status(200).json({
      success: true,
      count: memories.length,
      memories,
    });
  } catch (error) {
    next(error);
  }
};
