const CompanyRepository = require('../data-access/companies');
const UserRepository = require('../data-access/users');
const EmployeeRepository = require('../data-access/employees');
const { ForbiddenError } = require('../utils/errors/types/Api.error');

const isCompanyMiddleware = async (req, res, next) => {
  try {
    let company;
    let isSuperAdmin = false;
    let employeeRecord = null;

    // First check if request is from a company account
    company = await CompanyRepository.findById(req.userId);
    
    const user = await UserRepository.findByIdExcludeProps(req.userId, ['password_hash']);
      
    if (!user) {
      throw new ForbiddenError('User not found');
    }
    
    // Only employees can potentially have company permissions
    if (user.acc_type !== 'employee') {
      throw new ForbiddenError('Access denied. Company or admin privileges required');
    }
    
    // Check if user is an employee with super-admin role
    employeeRecord = await EmployeeRepository.findOne({
      where: { user_id: user.user_id },
      include: ['company']
    });
    
    if (!employeeRecord || !employeeRecord.company) {
      throw new ForbiddenError('Access denied. Not associated with any company');
    }
    
    // Check for super-admin role
    if (employeeRecord.role === 'super-admin') {
      isSuperAdmin = true;
      company = employeeRecord.company;
    } else {
      throw new ForbiddenError('Access denied. Super-admin privileges required');
    }
    
    // At this point we should have a company, either direct or through employee association
    if (!company) {
      throw new ForbiddenError('Access denied. Company access required');
    }
    
    // Set request properties for downstream use
    req.company = company;
    
    // If super admin, set additional flags
    if (isSuperAdmin) {
      req.isAdmin = true;
      req.adminEmployee = employeeRecord;
      req.employeeRole = employeeRecord.role;
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isCompanyMiddleware;

