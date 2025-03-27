import {
    NotFoundError,
    BadRequestError,
    ValidationError,
    BadTokenError,
    TokenExpiredError,
    UnauthorizedError,
    ForbiddenError,
    InternalServerError,
    CorsError,
    isApiError
} from "./types/Api.error";

import {
    DatabaseError,
    isDatabaseError
} from "./types/Sequelize.error";

module.exports = {
    // API Errors
    NotFoundError,
    BadRequestError,
    ValidationError,
    BadTokenError,
    TokenExpiredError,
    UnauthorizedError,
    ForbiddenError,
    InternalServerError,
    CorsError,
    // Database Errors
    DatabaseError,
    // Utils
    isApiError,
    isDatabaseError,
};
