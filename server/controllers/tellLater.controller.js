import Item from '../models/Item.js';
import { isDbConnected } from '../config/db.js';
import { logger } from '../utils/logger.js';

/**
 * Get all items to tell Neeraj / tell later
 */
export const getTellLaterItems = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        message: "Database connection unavailable. Please try again.",
        items: []
      });
    }

    const items = await Item.find({
      intent: 'tell_later',
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    logger.error(`[TellLater Error] ${error.message}`);
    next(error);
  }
};

/**
 * Mark a tell-later item as completed/told
 */
export const completeTellLaterItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        message: "Database connection unavailable."
      });
    }

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    item.isCompleted = !item.isCompleted;
    item.completedAt = item.isCompleted ? new Date() : null;
    await item.save();

    return res.status(200).json({
      success: true,
      message: item.isCompleted ? 'Marked as told ♡' : 'Restored to queue',
      item,
    });
  } catch (error) {
    logger.error(`[CompleteTellLater Error] ${error.message}`);
    next(error);
  }
};
