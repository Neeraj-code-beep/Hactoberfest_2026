import Item from '../models/Item.js';
import { isDbConnected } from '../config/db.js';
import { gemmaService } from '../services/gemma/gemma.service.js';
import { logger } from '../utils/logger.js';

/**
 * Ask Lumi a natural question about memories and saved thoughts
 */
export const askLumi = async (req, res, next) => {
  try {
    const { question } = req.body;
    const q = (question || '').trim();

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Please enter a question to ask Lumi."
      });
    }

    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        message: "Database connection unavailable. Please try again."
      });
    }

    logger.info(`[AskLumi] Searching memories for query: "${q}"`);

    // Build intelligent query filters based on question semantics
    const qLower = q.toLowerCase();
    let query = {};

    if (qLower.includes('neeraj') || qLower.includes('tell')) {
      query.intent = 'tell_later';
      if (qLower.includes('neeraj')) query.recipient = 'Neeraj';
    } else if (qLower.includes('college')) {
      query.$or = [
        { category: 'college' },
        { content: { $regex: 'college|class|prof|lecture', $options: 'i' } }
      ];
    } else if (qLower.includes('memory') || qLower.includes('memories')) {
      query.intent = { $in: ['memory', 'note'] };
    } else if (qLower.includes('week') || qLower.includes('recent')) {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      query.createdAt = { $gte: sevenDaysAgo };
    } else {
      // General keyword search
      const words = q.split(/\s+/).filter((w) => w.length > 3);
      if (words.length > 0) {
        query.$or = words.map((w) => ({
          content: { $regex: w, $options: 'i' }
        }));
      }
    }

    // Retrieve matching items sorted by recent first
    let matchingItems = await Item.find(query).sort({ createdAt: -1 }).limit(10).lean();

    // If specific keyword query returned 0, fallback to recent overall items
    if (matchingItems.length === 0) {
      matchingItems = await Item.find().sort({ createdAt: -1 }).limit(8).lean();
    }

    // If still no records in DB
    if (matchingItems.length === 0) {
      return res.status(200).json({
        success: true,
        answer: "I couldn't find anything matching that yet.",
        sources: []
      });
    }

    // Ask Gemma using retrieved MongoDB records as verified ground truth
    const answer = await gemmaService.answerQuestion(q, matchingItems);

    logger.info(`[AskLumi] Generated response based on ${matchingItems.length} sources`);

    return res.status(200).json({
      success: true,
      answer,
      sources: matchingItems.map((item) => ({
        id: item._id,
        content: item.content,
        intent: item.intent,
        category: item.category,
        recipient: item.recipient,
        createdAt: item.createdAt,
      })),
    });
  } catch (error) {
    logger.error(`[AskLumi Error] ${error.message}`);
    next(error);
  }
};
