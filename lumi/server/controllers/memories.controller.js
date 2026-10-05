import Item from '../models/Item.js';
import { isDbConnected } from '../config/db.js';
import { logger } from '../utils/logger.js';

/**
 * Get memories timeline
 */
export const getMemories = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        message: "Database connection unavailable. Please try again.",
        memories: []
      });
    }

    const items = await Item.find({
      intent: { $in: ['memory', 'note', 'reminder'] },
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: items.length,
      memories: items,
    });
  } catch (error) {
    logger.error(`[Memories Error] ${error.message}`);
    next(error);
  }
};
