import Item from '../models/Item.js';
import { isDbConnected } from '../config/db.js';
import { fallbackItems } from './capture.controller.js';

/**
 * Get all items to tell Dheeraj
 */
export const getTellLaterItems = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const items = await Item.find({
        intent: 'tell_later',
      }).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: items.length,
        items,
      });
    }

    const items = fallbackItems.filter((i) => i.intent === 'tell_later');
    return res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark a tell-later item as completed/told
 */
export const completeTellLaterItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const item = await Item.findById(id);
      if (!item) {
        return res.status(404).json({ success: false, message: 'Item not found' });
      }

      item.isCompleted = !item.isCompleted;
      item.completedAt = item.isCompleted ? new Date() : null;
      await item.save();

      return res.status(200).json({
        success: true,
        message: item.isCompleted ? 'Marked as told to Dheeraj ♡' : 'Restored to queue',
        item,
      });
    }

    const item = fallbackItems.find((i) => i._id === id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    item.isCompleted = !item.isCompleted;
    item.completedAt = item.isCompleted ? new Date().toISOString() : null;

    return res.status(200).json({
      success: true,
      message: item.isCompleted ? 'Marked as told to Dheeraj ♡' : 'Restored to queue',
      item,
    });
  } catch (error) {
    next(error);
  }
};
