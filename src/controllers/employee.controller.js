const Yup = require("yup");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
// Import repositories
import UserRepository from "../data-access/users";
import EmployeeRepository from "../data-access/employees";
import CompanyRepository from "../data-access/companies";
const { createPagination } = require("../utils/responseHandler");
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError
} = require("../utils/errors/types/Api.error");

const employeeController = {
  addEmployee: async (req, res, next) => {
    try {
      const { companyId } = req.params;
      
      // Check if the authenticated user belongs to this company
      if (parseInt(companyId) !== req.company.company_id) {
        throw new ForbiddenError('You do not have permission to add employees to this company');
      }
      
      const { email, username, password, role } = req.body;

      // Check if user already exists
      const userExists = await UserRepository.findOneByEmailOrUsername({ email, username });

      if (userExists) {
        throw new BadRequestError('User with this email or username already exists');
      }

      // Create user with employee account type
      const password_hash = await bcrypt.hash(password, 8);
      
      const user = await UserRepository.create({
        ...req.body,
        acc_type: 'employee',
        password_hash
      });
      
      // Create employee association
      const employee = await EmployeeRepository.create({
        user_id: user.user_id,
        company_id: companyId,
        role
      });

      // Return user and employee data
      user.password_hash = undefined;

      return res.success('Employee added successfully', { user, employee });
    } catch (error) {
      next(error);
    }
  },

  getEmployees: async (req, res, next) => {
    try {
      const { companyId } = req.params;
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      
      // Check if the authenticated user has permission to view employees
      const company = await CompanyRepository.findById(companyId);
      
      if (!company) {
        throw new NotFoundError('Company not found');
      }
      
      // If not admin or not from this company, check if approved
      if (req.userId !== parseInt(companyId) && !req.adminEmployee) {
        const employeeCheck = await EmployeeRepository.findByUserAndCompany(req.userId, companyId);
        
        if (!employeeCheck) {
          throw new ForbiddenError('You do not have permission to view employees for this company');
        }
      }
      
      // Use new repository method
      const { count, rows } = await EmployeeRepository.findCompanyEmployeesPaginated(companyId, page, limit);
      
      const pagination = createPagination(page, limit, count);

      return res.success('Employees retrieved successfully', rows, pagination);
    } catch (error) {
      next(error);
    }
  },

  deleteEmployee: async (req, res, next) => {
    try {
      const { companyId, employeeId } = req.params;
      
      // Check if the authenticated user belongs to this company
      if (parseInt(companyId) !== req.company.company_id) {
        throw new ForbiddenError('You do not have permission to delete employees from this company');
      }
      
      const employee = await EmployeeRepository.findByUserAndCompany(employeeId, companyId);
      
      if (!employee) {
        throw new NotFoundError('Employee not found');
      }
      
      // Don't allow deleting super-admin if there's only one - use repository method
      if (employee.role === 'super-admin') {
        const adminCount = await EmployeeRepository.countCompanyAdmins(companyId);
        
        if (adminCount <= 1) {
          throw new BadRequestError('Cannot delete the only super-admin. Assign another super-admin first.');
        }
      }
      
      // Delete the employee association
      await EmployeeRepository.delete(employee.id);
      
      return res.success('Employee removed successfully');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = employeeController;
