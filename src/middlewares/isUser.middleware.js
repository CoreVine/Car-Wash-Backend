const User = require('../models/User');
const { ForbiddenError } = require('../utils/errors/types/Api.error');

const isUserMiddleware = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      throw new ForbiddenError('Access denied. User privileges required');
    }
    
    // Add user info to request for later use
    req.user = user;
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isUserMiddleware;
