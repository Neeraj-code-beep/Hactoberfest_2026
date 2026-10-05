import Item from '../models/Item.js';
import { isDbConnected } from '../config/db.js';
import { gemmaService } from '../services/gemma/gemma.service.js';
import { logger } from '../utils/logger.js';

export const captureThought = async (req, res, next) => {
  try {
    const { text, content } = req.body;
    const rawInput = (text || content || '').trim();

    if (!rawInput) {
      return res.status(400).json({
        success: false,
        message: "Please enter a thought to save."
      });
    }

    if (!isDbConnected()) {
      logger.warn('[Capture] Database is disconnected.');
      return res.status(503).json({
        success: false,
        message: "Unable to save your thought right now. Please try again."
      });
    }

    // Process structured intent and actions via real Gemma 2 on Ollama
    let extracted;
    try {
      extracted = await gemmaService.extractIntent(rawInput);
    } catch (gemmaErr) {
      logger.error(`[Capture] Gemma AI processing error: ${gemmaErr.message}`);
      return res.status(502).json({
        success: false,
        message: "Could not understand that thought right now. Please try again."
      });
    }

    const itemsToSave = extracted.items || [];
    const savedDocs = [];

    for (const item of itemsToSave) {
      const doc = await Item.create({
        content: item.content || rawInput,
        intent: item.intent,
        recipient: item.recipient,
        category: item.category,
        priority: item.priority,
        aiInterpretation: `${item.intent === 'tell_later' && item.recipient ? `Tell ${item.recipient}` : item.intent} • ${item.category}`,
      });
      savedDocs.push(doc);
    }

    // Determine gentle, truthful response message
    let friendlyMessage = "Saved for later ♡";
    const meal = extracted.mealAssistance;

    if (meal?.promptForIngredients) {
      friendlyMessage = "You’ve been busy and haven’t eaten yet. If you want, tell me what food or ingredients you have and I can suggest something simple.";
    } else if (meal?.suggestion) {
      friendlyMessage = meal.suggestion;
    } else if (savedDocs.length > 1) {
      friendlyMessage = `Saved ${savedDocs.length} items for you ♡`;
    } else if (savedDocs.length === 1) {
      const single = savedDocs[0];
      if (single.intent === 'tell_later' && single.recipient === 'Neeraj') {
        friendlyMessage = "Saved for Neeraj ♡";
      } else if (single.intent === 'self_care') {
        friendlyMessage = "Saved your check-in ♡";
      } else if (single.intent === 'reminder') {
        friendlyMessage = "Reminder saved ♡";
      } else {
        friendlyMessage = "Saved to your memories ♡";
      }
    }

    logger.info(`[Capture] Saved ${savedDocs.length} document(s) to MongoDB from input: "${rawInput}"`);

    return res.status(201).json({
      success: true,
      items: savedDocs,
      item: savedDocs[0] || null,
      intent: savedDocs[0]?.intent || 'memory',
      recipient: savedDocs[0]?.recipient || null,
      category: savedDocs[0]?.category || 'general',
      priority: savedDocs[0]?.priority || 'normal',
      mealAssistance: extracted.mealAssistance,
      friendlyMessage,
    });
  } catch (error) {
    logger.error(`[Capture Error] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Unable to save your thought right now. Please try again."
    });
  }
};
