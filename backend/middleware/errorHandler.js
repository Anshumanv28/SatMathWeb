import AppError from '../utils/appError.js';

export class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

// Error handler middleware
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new NotFoundError(message);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ValidationError(message);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new ValidationError(message);
  }

  // Supabase errors
  if (err.message && err.message.includes('JWT')) {
    error = new AuthenticationError('Invalid or expired token');
  }

  if (err.message && err.message.includes('duplicate key')) {
    error = new ValidationError('This record already exists');
  }

  // Default error response
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // Development error response
  if (process.env.NODE_ENV === 'development') {
    res.status(statusCode).json({
      success: false,
      error: {
        message,
        statusCode,
        stack: err.stack,
        ...error
      }
    });
  } else {
    // Production error response
    res.status(statusCode).json({
      success: false,
      error: {
        message: statusCode === 500 ? 'Internal Server Error' : message
      }
    });
  }
};

// Async error wrapper
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler
export const notFoundHandler = (req, res, next) => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`);
  next(error);
};

// Request validation middleware
export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      if (schema.body) {
        const { error } = schema.body.validate(req.body);
        if (error) {
          throw new ValidationError(error.details[0].message);
        }
      }
      
      if (schema.query) {
        const { error } = schema.query.validate(req.query);
        if (error) {
          throw new ValidationError(error.details[0].message);
        }
      }
      
      if (schema.params) {
        const { error } = schema.params.validate(req.params);
        if (error) {
          throw new ValidationError(error.details[0].message);
        }
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Rate limiting error handler
export const rateLimitErrorHandler = (err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      error: {
        message: 'Request entity too large'
      }
    });
  }
  next(err);
};

// CORS error handler
export const corsErrorHandler = (err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      error: {
        message: 'CORS policy violation'
      }
    });
  }
  next(err);
}; 