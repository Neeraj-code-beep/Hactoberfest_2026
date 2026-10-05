import { logger } from '../utils/logger.js';

/**
 * Centralized Express error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : (err.status || 500);
  
  logger.error(`[HTTP ${statusCode}] ${req.method} ${req.originalUrl} - ${err.message}`, {
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

/**
 * 404 Not Found Handler
 */
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Resource Not Found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};
