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

    // Verify MongoDB connection before attempting capture
    if (!isDbConnected()) {
      logger.warn('[Capture] Database is disconnected. Rejecting write operation.');
      return res.status(503).json({
        success: false,
        message: "Unable to save your thought right now. Please try again."
      });
    }

    // Process structured intent via real Gemma 2 on Ollama
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

    // Truthful friendly response messages
    let friendlyMessage = "Saved for later ♡";
    if (extracted.intent === 'tell_later') {
      friendlyMessage = extracted.recipient ? `Saved for ${extracted.recipient} ♡` : "Saved for later ♡";
    } else if (extracted.intent === 'self_care') {
      friendlyMessage = "Saved your check-in ♡";
    } else if (extracted.intent === 'reminder') {
      friendlyMessage = "Reminder saved ♡";
    } else {
      friendlyMessage = "Saved to your memories ♡";
    }

    // Persist validated document to MongoDB
    const savedItem = await Item.create({
      content: extracted.content || rawInput,
      intent: extracted.intent,
      recipient: extracted.recipient,
      category: extracted.category,
      priority: extracted.priority,
      aiInterpretation: `${extracted.intent === 'tell_later' && extracted.recipient ? `Tell ${extracted.recipient}` : extracted.intent} • ${extracted.category}`,
    });

    logger.info(`[Capture] Successfully saved thought to MongoDB with ID ${savedItem._id} (intent: ${extracted.intent}, recipient: ${extracted.recipient})`);

    return res.status(201).json({
      success: true,
      item: savedItem,
      intent: extracted.intent,
      recipient: extracted.recipient,
      category: extracted.category,
      priority: extracted.priority,
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
