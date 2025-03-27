const DEFAULT_ERRORS = {
    BAD_TOKEN: {
        code: "BAD_TOKEN",
        message: "Token is not valid",
    },
    TOKEN_EXPIRED: {
        code: "TOKEN_EXPIRED",
        message: "Token expired",
    },
    REFRESH_DISABLED: {
        code: "REFRESH_DISABLED",
        message: "Refresh token functionality is not enabled",
    },
    JWT_EXPIRY_DISABLED: {
        code: "JWT_EXPIRY_DISABLED",
        message: "JWT expiration is not enabled",
    },
    UNAUTHORIZED: {
        code: "UNAUTHORIZED",
        message: "Invalid credentials",
    },
    SERVER_ERROR: {
        code: "SERVER_ERROR",
        message: "Internal server error",
    },
    NOT_FOUND: {
        code: "NOT_FOUND",
        message: "Not found",
    },
    BAD_REQUEST: {
        code: "BAD_REQUEST",
        message: "Bad request",
    },
    FORBIDDEN: {
        code: "FORBIDDEN",
        message: "Permission denied",
    },
    VALIDATION: {
        code: "VALIDATION",
        message: "Validation error",
    },
    DATABASE_ERROR: {
        code: "DATABASE_ERROR",
        message: "Database error",
    },
    CORS_ERROR: {
        code: "CORS_ERROR",
        message: "CORS policy violation: Origin not allowed",
    }
};


module.exports = DEFAULT_ERRORS;
