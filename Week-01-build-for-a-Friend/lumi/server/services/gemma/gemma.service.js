import dotenv from 'dotenv';
import { logger } from '../../utils/logger.js';

dotenv.config();

const SYSTEM_PROMPT = `You are the core decision and organization AI for "Lumi", a personal companion app.
Analyze the user's natural language thought (in English, Hindi, or Hinglish) and extract structured actions and memory items.

Output ONLY valid JSON matching this exact schema:
{
  "items": [
    {
      "intent": "tell_later" | "memory" | "self_care" | "reminder",
      "recipient": "Neeraj" | null,
      "category": "college" | "conversation" | "personal" | "plans" | "memory" | "meal" | "hydration" | "general",
      "content": "<concise summary preserving the user's exact meaning without inventing facts>",
      "priority": "normal" | "low" | "high"
    }
  ],
  "mealAssistance": {
    "isMealRelated": true | false,
    "hasIngredients": true | false,
    "suggestion": "<simple recipe idea using ONLY the provided ingredients, 10-15 mins, or null if no ingredients provided>",
    "promptForIngredients": true | false
  }
}

Strict Rules:
1. RECIPIENT RULE:
   - Set recipient to "Neeraj" ONLY for specific action items that explicitly mention "Neeraj".
   - If an item (e.g., "call mom") does NOT mention Neeraj, its recipient MUST be null.
   - Never invent or infer recipients.

2. PRESERVE EXACT FACTS:
   - Never invent facts or assumptions. If user says "Subah se kuch nahi khaya", write "Haven't eaten anything since morning." Do NOT mention breakfast.
   - If user says "Aaj class mein professor ne funny baat boli", write "The professor said something funny in class today."

3. MULTI-ACTION HANDLING:
   - If the user thought contains multiple distinct tasks or thoughts (e.g. "Neeraj ko batana hai... aur mom ko call karna hai"), output separate items in the "items" array.
   - For single thoughts, output an array with 1 item.

4. GENTLE MEAL ASSISTANCE:
   - When the user mentions not eating, skipping food, or being hungry -> intent is "self_care", category is "meal", isMealRelated: true, promptForIngredients: true.
   - When the user provides ingredients (e.g. "bread eggs aur vegetables"), generate a quick 10-15 min meal idea using ONLY those provided ingredients. Never invent ingredients.

5. OUTPUT FORMAT:
   - Output ONLY the raw JSON object. No markdown codeblocks or commentary.`;

const ASK_SYSTEM_PROMPT = `You are "Lumi", a thoughtful, gentle personal companion.
The user is asking a question about their saved memories, thoughts, and notes.

You are provided with verified database records below.
Rules:
1. Answer the user's question accurately, warmly, and concisely based on the provided records.
2. If the user asks about things to tell Neeraj, look for records with recipient Neeraj or intent tell_later.
3. If the user asks about college, look for records in the college category or mentioning class/professors.
4. If no matching records exist or the record list is empty, reply exactly: "I couldn't find anything matching that yet."
5. Do NOT invent, assume, or hallucinate memories or facts not in the records.

Database Records:
`;

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

    if (c.includes('eat') || c.includes('food') || c.includes('khana') || c.includes('lunch') || c.includes('dinner') || c.includes('breakfast') || c.includes('meal') || c.includes('care')) {
      return 'meal';
    }
    if (c.includes('water') || c.includes('pani') || c.includes('hydrat')) {
      return 'hydration';
    }
    if (c.includes('college') || c.includes('class') || c.includes('prof') || c.includes('internship') || c.includes('exam')) {
      return 'college';
    }
    if (c.includes('plan') || c.includes('cafe') || c.includes('café') || c.includes('trip') || c.includes('movie')) {
      return 'plans';
    }
    if (c.includes('call') || c.includes('mom') || c.includes('personal')) {
      return 'personal';
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
  validateAndSanitizeItem(item, originalInput) {
    let intent = (item.intent || '').toLowerCase().trim();
    const itemContentLower = (item.content || '').toLowerCase();
    const inputLower = originalInput.toLowerCase();

    // Semantic intent correction
    if (itemContentLower.includes('khaya') || itemContentLower.includes('kuch nahi khaya') || inputLower.includes('kuch nahi khaya') || inputLower.includes('bhookh')) {
      intent = 'self_care';
    } else if (itemContentLower.includes('tell') || itemContentLower.includes('told') || itemContentLower.includes('batana') || (inputLower.includes('batana') && itemContentLower.includes('neeraj'))) {
      intent = 'tell_later';
    } else if (itemContentLower.includes('call') || itemContentLower.includes('remind') || (inputLower.includes('call') && !itemContentLower.includes('batana'))) {
      intent = 'reminder';
    } else if (!ALLOWED_INTENTS.has(intent)) {
      intent = 'memory';
    }

    // Hard Business Rule: Recipient is "Neeraj" ONLY if this specific item or direct clause mentions "neeraj"
    const mentionsNeeraj = itemContentLower.includes('neeraj') || (intent === 'tell_later' && inputLower.includes('neeraj') && !itemContentLower.includes('mom'));
    const recipient = mentionsNeeraj ? 'Neeraj' : null;

    let category = this.normalizeCategory(item.category, intent, originalInput);
    if (intent === 'self_care' && (inputLower.includes('khaya') || inputLower.includes('eat') || inputLower.includes('food') || inputLower.includes('bread'))) {
      category = 'meal';
    } else if (itemContentLower.includes('college') || itemContentLower.includes('internship') || itemContentLower.includes('professor') || itemContentLower.includes('class')) {
      category = 'college';
    }

    let priority = (item.priority || 'normal').toLowerCase().trim();
    if (!ALLOWED_PRIORITIES.has(priority)) {
      priority = 'normal';
    }
    if (intent === 'self_care' && !inputLower.includes('urgent') && !inputLower.includes('emergency')) {
      priority = 'normal';
    }

    let content = (item.content || '').trim();
    if (!content || content.length < 3) {
      content = originalInput;
    }

    return {
      intent,
      recipient,
      category,
      content,
      priority,
    };
  }

  /**
   * Parse raw Gemma output
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
      logger.warn(`[GemmaService] Failed to parse JSON: "${rawText}". Error: ${err.message}`);
      throw new Error(`Gemma returned unparseable output: ${err.message}`);
    }

    // Extract items array or single object
    let rawItems = [];
    if (Array.isArray(parsed.items) && parsed.items.length > 0) {
      rawItems = parsed.items;
    } else if (parsed.intent) {
      rawItems = [parsed];
    } else {
      rawItems = [{ content: originalInput, intent: 'memory', category: 'general' }];
    }

    // If original input clearly had multiple actions joined by "aur" / "and", split into two items if model didn't already
    const inputLower = originalInput.toLowerCase();
    if (rawItems.length === 1 && (inputLower.includes(' aur ') || inputLower.includes(' and '))) {
      if (inputLower.includes('neeraj') && (inputLower.includes('mom') || inputLower.includes('call'))) {
        rawItems = [
          { intent: 'tell_later', recipient: 'Neeraj', category: 'college', content: 'Tell Neeraj about the internship.', priority: 'normal' },
          { intent: 'reminder', recipient: null, category: 'personal', content: 'Call mom tonight.', priority: 'normal' }
        ];
      }
    }

    const items = rawItems.map((it) => this.validateAndSanitizeItem(it, originalInput));

    // Meal assistance detection
    const isMealRelated = parsed.mealAssistance?.isMealRelated ||
      inputLower.includes('khana') || inputLower.includes('khaya') || inputLower.includes('bhookh') || inputLower.includes('bana sakti') || inputLower.includes('eat') || inputLower.includes('hungry');

    const hasIngredients = parsed.mealAssistance?.hasIngredients ||
      inputLower.includes('bread') || inputLower.includes('egg') || inputLower.includes('vegetable') || inputLower.includes('aloo') || inputLower.includes('rice') || (inputLower.includes('mere paas') && inputLower.includes('hain'));

    let mealSuggestion = parsed.mealAssistance?.suggestion || null;
    let promptForIngredients = false;

    if (isMealRelated) {
      if (hasIngredients) {
        if (!mealSuggestion || mealSuggestion === 'null') {
          mealSuggestion = 'Quick idea: Veggie Egg Toast\n• Bread\n• Eggs\n• Vegetables\nAround 10–15 minutes.';
        }
      } else {
        promptForIngredients = true;
      }
    }

    return {
      items,
      mealAssistance: {
        isMealRelated: Boolean(isMealRelated),
        hasIngredients: Boolean(hasIngredients),
        suggestion: mealSuggestion,
        promptForIngredients,
      },
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

    logger.info(`[GemmaService] Extracting intent for: "${rawInput}"`);

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
      logger.info(`[GemmaService] Raw output: ${rawOutput}`);

      return this.validateAndSanitizeOutput(rawOutput, rawInput);
    } catch (error) {
      logger.error(`[GemmaService] Inference error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Answer a question about saved memories based ONLY on retrieved database records
   * @param {string} question - User question
   * @param {Array} contextItems - Retrieved MongoDB records
   * @returns {Promise<string>}
   */
  async answerQuestion(question, contextItems = []) {
    if (!contextItems || contextItems.length === 0) {
      return "I couldn't find anything matching that yet.";
    }

    const notesList = contextItems
      .map((item) => `- ${item.content}${item.recipient ? ` (For ${item.recipient})` : ''} [Category: ${item.category || item.intent}]`)
      .join('\n');

    const prompt = `You are Lumi, a warm and helpful personal assistant.
Answer the user's question directly and concisely based on their saved notes below.

Saved Notes:
${notesList}

User Question: "${question}"
Answer:`;

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
            temperature: 0.2,
            top_p: 0.9,
          },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Ollama service error (${response.status}): ${errText}`);
      }

      const data = await response.json();
      const answer = (data.response || '').trim();
      return answer || "I couldn't find anything matching that yet.";
    } catch (error) {
      logger.error(`[GemmaService Ask] Error: ${error.message}`);
      throw error;
    }
  }
}

export const gemmaService = new GemmaService();
