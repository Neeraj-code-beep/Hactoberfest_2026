import dotenv from 'dotenv';
import { logger } from '../../utils/logger.js';

dotenv.config();

const SYSTEM_PROMPT = `You are the core decision and organization AI for "Lumi", a personal companion app.
Your task is to analyze a user's natural language thought/note (which may be in English, Hindi, or Hinglish) and extract structured intent.

You must output ONLY valid JSON matching this exact schema:
{
  "intent": "tell_later" | "memory" | "self_care" | "reminder",
  "recipient": "Neeraj",
  "category": "college" | "plans" | "care" | "health" | "moment" | "general" | "conversation",
  "content": "<concise cleaned summary or transcription of the thought>",
  "priority": "low" | "normal" | "high"
}

Intent Classification Rules:
1. "tell_later": The user wants to share something later with Neeraj (e.g. "Neeraj ko batana hai...", "Tell Neeraj...", funny class moments to share, discussions for later).
2. "self_care": The user mentions eating, meals (breakfast/lunch/dinner), drinking water, feeling tired, skipping meals, or physical well-being.
3. "reminder": The user wants to remember a specific task, deadline, or errand.
4. "memory": Personal reflections, beautiful moments, quotes, sunsets, cozy places, feelings to remember.

Rules:
- If someone is to be told or shared with, recipient is always "Neeraj".
- Output ONLY the raw JSON object. Do not include markdown codeblocks, explanations, or any conversational text.`;

const ALLOWED_INTENTS = new Set(['tell_later', 'memory', 'self_care', 'reminder']);
const ALLOWED_PRIORITIES = new Set(['low', 'normal', 'high']);

class GemmaService {
  constructor() {
    this.provider = process.env.GEMMA_PROVIDER || 'ollama';
    this.modelName = process.env.GEMMA_MODEL || 'gemma2:2b';
    this.baseUrl = process.env.GEMMA_BASE_URL || 'http://127.0.0.1:11434';
    logger.info(`[GemmaService] Initialized with provider: ${this.provider}, model: ${this.modelName}, endpoint: ${this.baseUrl}`);
  }

  /**
   * Parse raw LLM output into validated structured object
   */
  validateAndSanitizeOutput(rawText, originalInput) {
    let parsed;
    try {
      // Extract JSON substring if surrounded by markdown or quotes
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        parsed = JSON.parse(rawText.trim());
      }
    } catch (err) {
      logger.warn(`[GemmaService] Failed to parse JSON from Gemma output: "${rawText}". Error: ${err.message}`);
      throw new Error(`Invalid JSON returned by Gemma: ${err.message}`);
    }

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Gemma output is not a valid JSON object');
    }

    // Validate and sanitize intent
    let intent = (parsed.intent || '').toLowerCase().trim();
    if (!ALLOWED_INTENTS.has(intent)) {
      if (intent.includes('tell') || intent.includes('share')) intent = 'tell_later';
      else if (intent.includes('care') || intent.includes('eat') || intent.includes('water')) intent = 'self_care';
      else if (intent.includes('remind')) intent = 'reminder';
      else intent = 'memory';
    }

    // Validate priority
    let priority = (parsed.priority || 'normal').toLowerCase().trim();
    if (!ALLOWED_PRIORITIES.has(priority)) {
      priority = 'normal';
    }

    const recipient = parsed.recipient || (intent === 'tell_later' ? 'Neeraj' : undefined);
    const category = (parsed.category || 'general').toLowerCase().trim();
    const content = (parsed.content || originalInput).trim();

    return {
      intent,
      recipient: recipient || 'Neeraj',
      category: category || 'general',
      content: content || originalInput,
      priority,
      rawGemmaResponse: rawText.trim(),
    };
  }

  /**
   * Process natural language thought via Ollama Gemma 2 model
   * @param {string} text - User natural language thought
   * @returns {Promise<{ intent: string, recipient: string, category: string, content: string, priority: string, rawGemmaResponse: string }>}
   */
  async extractIntent(text) {
    const rawInput = (text || '').trim();
    if (!rawInput) {
      throw new Error('Input text cannot be empty');
    }

    logger.info(`[GemmaService] Running real inference on Gemma 2 for: "${rawInput}"`);

    const prompt = `${SYSTEM_PROMPT}

User Thought: "${rawInput}"
JSON Output:`;

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.modelName,
          prompt,
          stream: false,
          options: {
            temperature: 0.1, // low temperature for consistent structured JSON extraction
            top_p: 0.9,
          },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Ollama API error (${response.status}): ${errText}`);
      }

      const data = await response.json();
      const rawOutput = data.response;
      logger.info(`[GemmaService] Raw Gemma inference output: ${rawOutput}`);

      return this.validateAndSanitizeOutput(rawOutput, rawInput);
    } catch (error) {
      logger.error(`[GemmaService] Inference error: ${error.message}`);
      throw error;
    }
  }
}

export const gemmaService = new GemmaService();
