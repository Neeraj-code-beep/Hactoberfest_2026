import SelfCare from '../models/SelfCare.js';
import { isDbConnected } from '../config/db.js';
import { logger } from '../utils/logger.js';

const getTodayDateKey = () => new Date().toISOString().split('T')[0];

/**
 * Get today's self-care status from MongoDB
 */
export const getSelfCare = async (req, res, next) => {
  try {
    const today = getTodayDateKey();

    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        message: "Database connection unavailable.",
        data: {
          date: today,
          meals: { breakfast: false, lunch: false, dinner: false },
          waterGlasses: 0,
        }
      });
    }

    let record = await SelfCare.findOne({ date: today });
    if (!record) {
      record = await SelfCare.create({
        date: today,
        meals: { breakfast: false, lunch: false, dinner: false },
        waterGlasses: 0,
      });
    }

    return res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    logger.error(`[SelfCare Error] ${error.message}`);
    next(error);
  }
};

/**
 * Update today's self-care check-in in MongoDB
 */
export const updateSelfCare = async (req, res, next) => {
  try {
    const today = getTodayDateKey();
    const { meals, waterGlasses, notes } = req.body;

    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        message: "Database connection unavailable. Please try again."
      });
    }

    const updated = await SelfCare.findOneAndUpdate(
      { date: today },
      {
        $set: {
          ...(meals ? { meals } : {}),
          ...(waterGlasses !== undefined ? { waterGlasses } : {}),
          ...(notes !== undefined ? { notes } : {}),
        },
      },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Self-care logged ♡',
      data: updated,
    });
  } catch (error) {
    logger.error(`[UpdateSelfCare Error] ${error.message}`);
    next(error);
  }
};
