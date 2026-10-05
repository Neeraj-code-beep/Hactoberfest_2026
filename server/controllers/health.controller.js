import { isDbConnected } from '../config/db.js';

/**
 * Health check controller
 * Returns service status, database state, uptime, and system metadata
 */
export const getHealth = (req, res) => {
  const dbStatus = isDbConnected() ? 'connected' : 'disconnected';

  res.status(200).json({
    status: 'ok',
    service: 'Lumi Companion API',
    recipient: 'Ashmita',
    version: '1.0.0',
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbStatus,
    },
    timestamp: new Date().toISOString(),
    aiEngine: {
      provider: process.env.GEMMA_PROVIDER || 'gemma-local-or-api',
      status: 'ready'
    }
  });
};
