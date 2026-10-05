import { logger } from '../../utils/logger.js';

/**
 * Gemma AI Service Adapter
 * 
 * Modular interface for Gemma open-weight model integration.
 * In Phase 1, provides structured fallback/mock parsing for development.
 * In Phase 2+, connects to Gemma model via HuggingFace, Ollama, vLLM, or Gemma-cpp API.
 */
class GemmaService {
  constructor() {
    this.provider = process.env.GEMMA_PROVIDER || 'local-stub';
    this.modelName = process.env.GEMMA_MODEL || 'gemma-2-2b-it';
    logger.info(`[GemmaService] Initialized with provider: ${this.provider} (Model: ${this.modelName})`);
  }

  /**
   * Parse natural language thought/memo from Ashmita and extract structured intent
   * @param {string} text - Raw natural language input
   * @returns {Promise<{ intent: string, recipient?: string, category: string, content: string, priority: string }>}
   */
  async extractIntent(text) {
    logger.info(`[GemmaService] Extracting intent for input: "${text}"`);

    // In future phases: call local Gemma runtime or inference endpoint
    // Simple heuristic parser for preview during Phase 1
    const lower = text.toLowerCase();
    const isTellDheeraj = lower.includes('dheeraj') || lower.includes('batana') || lower.includes('tell');
    const isSelfCare = lower.includes('eat') || lower.includes('khana') || lower.includes('water') || lower.includes('rest');

    if (isTellDheeraj) {
      return {
        intent: 'tell_later',
        recipient: 'Dheeraj',
        category: 'conversation',
        content: text,
        priority: 'normal'
      };
    }

    if (isSelfCare) {
      return {
        intent: 'self_care',
        category: 'health',
        content: text,
        priority: 'high'
      };
    }

    return {
      intent: 'memory',
      category: 'general',
      content: text,
      priority: 'normal'
    };
  }
}

export const gemmaService = new GemmaService();
