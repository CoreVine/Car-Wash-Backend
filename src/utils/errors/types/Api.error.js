import DEFAULT_ERRORS from "../messages.errors";
import BaseError from "./Base.error";

/**
 * @class ApiError
 */
class ApiError extends BaseError {
  constructor(message, statusCode, type) {
    super(message, statusCode, type, true);
  }
}

export class NotFoundError extends ApiError {
  constructor(
    message = DEFAULT_ERRORS.NOT_FOUND.message,
    type = DEFAULT_ERRORS.NOT_FOUND.code
  ) {
    super(message, 404, type);
  }
}

export class BadRequestError extends ApiError {
  constructor(
    message = DEFAULT_ERRORS.BAD_REQUEST.message,
    type = DEFAULT_ERRORS.BAD_REQUEST.code
  ) {
    super(message, 400, type);
  }
}

export class ValidationError extends ApiError {
  constructor(
    message = DEFAULT_ERRORS.VALIDATION.message,
    type = DEFAULT_ERRORS.VALIDATION.code
  ) {
    super(message, 400, type);
    
    // Add errors property to contain the detailed validation errors
    this.errors = Array.isArray(message) ? message : [message];
  }
}

export class UnauthorizedError extends ApiError {
  constructor(
    message = DEFAULT_ERRORS.UNAUTHORIZED.message,
    type = DEFAULT_ERRORS.UNAUTHORIZED.code
  ) {
    super(message, 401, type);
  }
}
export class ForbiddenError extends ApiError {
  constructor(
    message = DEFAULT_ERRORS.FORBIDDEN.message,
    type = DEFAULT_ERRORS.FORBIDDEN.code
  ) {
    super(message, 403, type);
  }
}

export class InternalServerError extends ApiError {
  constructor(
    message = DEFAULT_ERRORS.SERVER_ERROR.message,
    type = DEFAULT_ERRORS.SERVER_ERROR.code
  ) {
    super(message, 500, type);
  }
}

export class BadTokenError extends ApiError {
  constructor(
    message = DEFAULT_ERRORS.BAD_TOKEN.message,
    type = DEFAULT_ERRORS.BAD_TOKEN.code
  ) {
    super(message, 401, type);
  }
}

export class TokenExpiredError extends ApiError {
  constructor(
    message = DEFAULT_ERRORS.TOKEN_EXPIRED.message,
    type = DEFAULT_ERRORS.TOKEN_EXPIRED.code
  ) {
    super(message, 401, type);
  }
}

export class CorsError extends ApiError {
  constructor(
    origin = null,
    message = DEFAULT_ERRORS.CORS_ERROR.message,
    type = DEFAULT_ERRORS.CORS_ERROR.code
  ) {
    const errorMessage = origin ? `${message}: ${origin}` : message;
    super(errorMessage, 403, type);
    this.origin = origin;
  }
}

/**
 * Check if error is an api specific error
 * @param {Error} err - Error object
 * @returns {boolean} - Is this error an ApiError
 */
export const isApiError = (err) =>
    err instanceof ApiError ? err.isOperational : false;
