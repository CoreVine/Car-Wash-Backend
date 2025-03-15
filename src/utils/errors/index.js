import {
    NotFoundError,
    BadRequestError,
    ValidationError,
    BadTokenError,
    TokenExpiredError,
    UnauthorizedError,
    ForbiddenError,
    InternalServerError,
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
    // Database Errors
    DatabaseError,
    // Utils
    isApiError,
    isDatabaseError,
};
