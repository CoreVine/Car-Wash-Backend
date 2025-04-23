const UserRepository = require('../data-access/users');
const { ForbiddenError } = require('../utils/errors/types/Api.error');

/**
 * Middleware to check if user is the owner of the requested resource
 */
const isSelfAuthorizedMiddleware = async (req, res, next) => {
  try {
    // Get the requested user ID from params
    const requestedUserId = parseInt(req.params.id);
    
    // Get the user making the request
    const user = await UserRepository.findByIdExcludeProps(req.userId, ['password_hash']);
    
    if (!user) {
      throw new ForbiddenError('User not found');
    }
    
    // Check if user is the owner of the account
    if (user.user_id === requestedUserId) {
      // User is authorized to operate on their own resource
      req.isSelfAuthorized = true;
      return next();
    }
    
    // If not self, reject the request
    throw new ForbiddenError('Access denied. Self-authorization required');
    
  } catch (error) {
    next(error);
  }
};

module.exports = isSelfAuthorizedMiddleware;
