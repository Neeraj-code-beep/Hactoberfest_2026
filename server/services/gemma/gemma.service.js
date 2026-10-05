import dotenv from 'dotenv';
import { logger } from '../../utils/logger.js';

dotenv.config();

const SYSTEM_PROMPT = `You are the core decision and organization AI for "Lumi", a personal companion app.
Your task is to analyze a user's natural language thought/note (which may be in English, Hindi, or Hinglish) and extract structured intent.

You must output ONLY valid JSON matching this exact schema:
{
  "intent": "tell_later" | "memory" | "self_care" | "reminder",
  "recipient": "Neeraj" | null,
  "category": "college" | "conversation" | "personal" | "plans" | "memory" | "meal" | "hydration" | "general",
  "content": "<concise normalized summary preserving the user's exact meaning without inventing facts>",
  "priority": "low" | "normal" | "high"
}

Strict Rules:
1. RECIPIENT RULE:
   - Set recipient to "Neeraj" ONLY when the user's input explicitly identifies Neeraj as the person the thought is intended for (e.g., "Neeraj ko batana hai...", "Tell Neeraj...").
   - If the input does NOT explicitly mention Neeraj, recipient MUST be null.
   - Never infer "Neeraj" as the recipient from context alone, and do NOT add a recipient simply because intent is "tell_later", "memory", or "self_care".
   - Never invent other person names.

2. INTENT CLASSIFICATION:
   - "tell_later": The user explicitly wants to share or discuss something later with someone.
   - "self_care": Mentions food, eating, meals (breakfast/lunch/dinner, skipped food), drinking water, rest, or nourishment.
   - "reminder": A specific task, deadline, or errand to do.
   - "memory": Personal reflections, beautiful moments, sunsets, cozy places, songs, quotes, or feelings to remember.

3. CATEGORY VOCABULARY:
   - Must be one of: "college", "conversation", "personal", "plans", "memory", "meal", "hydration", "general".
   - For food/eating/meals -> "meal".
   - For water/drinking -> "hydration".
   - For sunsets/peaceful moments/places/songs -> "memory".
   - For college/campus/professors -> "college".
   - For weekend plans/cafes -> "plans".

4. PRIORITY & SAFETY:
   - Default priority is "normal".
   - Ordinary self-care (e.g., "Subah se kuch nahi khaya") MUST be "normal" priority. Do not assign "high" unless there is explicit urgency.
   - Do NOT provide medical diagnoses or alerts.

5. OUTPUT FORMAT:
   - Output ONLY the raw JSON object. Do NOT include markdown blocks, explanations, or commentary.`;

const ALLOWED_INTENTS = new Set(['tell_later', 'memory', 'self_care', 'reminder']);
const ALLOWED_CATEGORIES = new Set(['college', 'conversation', 'personal', 'plans', 'memory', 'meal', 'hydration', 'general']);
const ALLOWED_PRIORITIES = new Set(['low', 'normal', 'high']);

class GemmaService {
  constructor() {
    this.provider = process.env.GEMMA_PROVIDER || 'ollama';
    this.modelName = process.env.GEMMA_MODEL || 'gemma2:2b';
    this.baseUrl = process.env.GEMMA_BASE_URL || 'http://127.0.0.1:11434';
  }

  /**
   * Normalize category to controlled vocabulary
   */
  normalizeCategory(cat, intent, rawInput) {
    const c = (cat || '').toLowerCase().trim();
    const inputLower = rawInput.toLowerCase();

    if (ALLOWED_CATEGORIES.has(c)) {
      return c;
    }

    if (c.includes('eat') || c.includes('food') || c.includes('khana') || c.includes('lunch') || c.includes('dinner') || c.includes('breakfast') || c.includes('care')) {
      return 'meal';
    }
    if (c.includes('water') || c.includes('pani') || c.includes('hydrat')) {
      return 'hydration';
    }
    if (c.includes('college') || c.includes('class') || c.includes('prof')) {
      return 'college';
    }
    if (c.includes('plan') || c.includes('cafe') || c.includes('café') || c.includes('trip')) {
      return 'plans';
    }
    if (c.includes('talk') || c.includes('chat') || c.includes('joke') || c.includes('convers')) {
      return 'conversation';
    }
    if (intent === 'memory' || c.includes('moment') || c.includes('sunset') || c.includes('song') || c.includes('place')) {
      return 'memory';
    }

    if (intent === 'self_care') {
      return inputLower.includes('water') || inputLower.includes('pani') ? 'hydration' : 'meal';
    }

    return 'general';
  }

  /**
   * Deterministic semantic normalization & business rule enforcement
   */
  validateAndSanitizeOutput(rawText, originalInput) {
    let parsed;
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        parsed = JSON.parse(rawText.trim());
      }
    } catch (err) {
      logger.warn(`[GemmaService] Failed to parse JSON from Gemma: "${rawText}". Error: ${err.message}`);
      throw new Error(`Gemma returned unparseable output: ${err.message}`);
    }

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Gemma output is not a valid JSON object');
    }

    // 1. Validate intent
    let intent = (parsed.intent || '').toLowerCase().trim();
    if (!ALLOWED_INTENTS.has(intent)) {
      const inputLower = originalInput.toLowerCase();
      if (inputLower.includes('batana') || inputLower.includes('tell')) {
        intent = 'tell_later';
      } else if (inputLower.includes('khaya') || inputLower.includes('eat') || inputLower.includes('water') || inputLower.includes('pani')) {
        intent = 'self_care';
      } else if (inputLower.includes('remind') || inputLower.includes('yaad dilana')) {
        intent = 'reminder';
      } else {
        intent = 'memory';
      }
    }

    // 2. HARD BUSINESS RULE: Recipient Normalization
    // Recipient is ONLY "Neeraj" when the input explicitly contains the name "neeraj"
    const inputLower = originalInput.toLowerCase();
    const explicitlyMentionsNeeraj = inputLower.includes('neeraj');

    let recipient = null;
    if (explicitlyMentionsNeeraj) {
      recipient = 'Neeraj';
    } else {
      recipient = null;
    }

    // 3. Category Normalization
    const category = this.normalizeCategory(parsed.category, intent, originalInput);

    // 4. Priority Normalization
    let priority = (parsed.priority || 'normal').toLowerCase().trim();
    if (!ALLOWED_PRIORITIES.has(priority)) {
      priority = 'normal';
    }
    // Self-care items are normal priority unless explicit urgent terms exist
    if (intent === 'self_care' && !inputLower.includes('urgent') && !inputLower.includes('emergency')) {
      priority = 'normal';
    }

    // 5. Content Normalization
    let content = (parsed.content || '').trim();
    if (!content || content.length < 3) {
      content = originalInput;
    }

    return {
      intent,
      recipient,
      category,
      content,
      priority,
      rawGemmaResponse: rawText.trim(),
    };
  }

  /**
   * Process natural language thought via Ollama Gemma 2
   */
  async extractIntent(text) {
    const rawInput = (text || '').trim();
    if (!rawInput) {
      throw new Error('Input thought cannot be empty');
    }

    logger.info(`[GemmaService] Processing thought with Gemma 2: "${rawInput}"`);

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
            temperature: 0.1,
            top_p: 0.9,
          },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Ollama service error (${response.status}): ${errText}`);
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
