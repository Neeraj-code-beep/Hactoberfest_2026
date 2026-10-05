import { isDbConnected } from '../config/db.js';

/**
 * Health check controller
 * Returns service status, database state, uptime, and AI engine status
 */
export const getHealth = (req, res) => {
  const dbStatus = isDbConnected() ? 'connected' : 'disconnected';

  res.status(200).json({
    status: 'ok',
    service: 'Lumi Companion API',
    recipient: 'Neeraj',
    version: '1.0.0',
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbStatus,
    },
    timestamp: new Date().toISOString(),
    aiEngine: {
      provider: process.env.GEMMA_PROVIDER || 'ollama',
      model: process.env.GEMMA_MODEL || 'gemma2:2b',
      status: 'ready'
    }
  });
};
