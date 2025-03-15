const User = require('../models/User');
const Employee = require('../models/Employee');
const { ForbiddenError } = require('../utils/errors/types/Api.error');

const isAdminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      throw new ForbiddenError('User not found');
    }
    
    if (user.acc_type !== 'employee') {
      throw new ForbiddenError('Access denied. Admin privileges required');
    }
    
    const employee = await Employee.findOne({
      where: {
        user_id: user.user_id,
        role: 'super-admin'
      }
    });
    
    if (!employee) {
      throw new ForbiddenError('Access denied. Admin privileges required');
    }
    
    // Add employee info to request for later use
    req.adminEmployee = employee;
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isAdminMiddleware;
