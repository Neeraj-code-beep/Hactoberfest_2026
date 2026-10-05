import SelfCare from '../models/SelfCare.js';
import { isDbConnected } from '../config/db.js';

const getTodayDateKey = () => new Date().toISOString().split('T')[0];

let fallbackSelfCare = {
  date: getTodayDateKey(),
  meals: {
    breakfast: true,
    lunch: false,
    dinner: false,
  },
  waterGlasses: 4,
  notes: 'Stay hydrated and take a pause during deep study!',
};

/**
 * Get today's self-care status
 */
export const getSelfCare = async (req, res, next) => {
  try {
    const today = getTodayDateKey();

    if (isDbConnected()) {
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
    }

    if (fallbackSelfCare.date !== today) {
      fallbackSelfCare = {
        date: today,
        meals: { breakfast: false, lunch: false, dinner: false },
        waterGlasses: 0,
        notes: '',
      };
    }

    return res.status(200).json({
      success: true,
      data: fallbackSelfCare,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update today's self-care status
 */
export const updateSelfCare = async (req, res, next) => {
  try {
    const today = getTodayDateKey();
    const { meals, waterGlasses, notes } = req.body;

    if (isDbConnected()) {
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
    }

    if (meals) fallbackSelfCare.meals = { ...fallbackSelfCare.meals, ...meals };
    if (waterGlasses !== undefined) fallbackSelfCare.waterGlasses = waterGlasses;
    if (notes !== undefined) fallbackSelfCare.notes = notes;

    return res.status(200).json({
      success: true,
      message: 'Self-care logged ♡',
      data: fallbackSelfCare,
    });
  } catch (error) {
    next(error);
  }
};
