const EmployeeRepository = require('../data-access/employees');
const { ForbiddenError } = require('../utils/errors/types/Api.error');

/**
 * Middleware to check if user is an employee
 */
const isEmployeeMiddleware = async (req, res, next) => {
  try {
    if (!req.userId) {
      throw new ForbiddenError('Authentication required');
    }

    // Check if user is an employee
    const employee = await EmployeeRepository.findByUserId(req.userId);
    
    if (!employee) {
      throw new ForbiddenError('Employee access required');
    }
    
    req.employee = employee;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isEmployeeMiddleware;
