const UserRepository = require('../data-access/users');
const EmployeeRepository = require('../data-access/employees');
const { ForbiddenError } = require('../utils/errors/types/Api.error');

const isAdminMiddleware = async (req, res, next) => {
  try {
    const user = await UserRepository.findByIdExcludeProps(req.userId, ['password_hash']);
    
    if (!user) {
      throw new ForbiddenError('User not found');
    }
    
    if (user.acc_type !== 'employee') {
      throw new ForbiddenError('Access denied. Admin privileges required');
    }
    
    const employee = await EmployeeRepository.findByUserId(user.user_id, req.companyId);
    
    if (!employee || employee.role !== 'super-admin') {
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

