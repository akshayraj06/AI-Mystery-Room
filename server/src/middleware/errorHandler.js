import { ApiError } from '../utils/apiError.js';
import { env } from '../config/env.js';

export function errorHandler(err, req, res, next) {
  // Safe server logging
  if (!env.isTest) {
    console.error(`[Error] [${req.method} ${req.originalUrl}]:`, err.message || err);
  }

  // Handle known ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {})
      }
    });
  }

  // Handle Zod validation errors
  if (err.name === 'ZodError') {
    const message = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ') || 'Validation failed';
    return res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message
      }
    });
  }

  // Handle Mongoose CastError / ValidationError
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message
      }
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      error: {
        code: 'INVALID_ID',
        message: 'Invalid resource identifier format.'
      }
    });
  }

  // Fallback for unexpected internal errors
  const status = err.status || 500;
  return res.status(status).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: env.isProduction ? 'An unexpected server error occurred.' : (err.message || 'Internal server error')
    }
  });
}
