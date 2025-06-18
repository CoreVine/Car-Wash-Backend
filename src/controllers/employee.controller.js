const bcrypt = require("bcryptjs");
// Import repositories
import UserRepository from "../data-access/users";
import EmployeeRepository from "../data-access/employees";
import CompanyRepository from "../data-access/companies";
const { createPagination } = require("../utils/responseHandler");
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require("../utils/errors/types/Api.error");

const employeeController = {
  addEmployee: async (req, res, next) => {
    try {
      const { companyId } = req.params;

      // Check if the authenticated user belongs to this company
      if (parseInt(companyId) !== req.company.company_id) {
        throw new ForbiddenError(
          "You do not have permission to add employees to this company"
        );
      }

      const { email, username, password, role } = req.body;

      // Check if user already exists
      const userExists = await UserRepository.findOneByEmailOrUsername({
        email,
        username,
      });

      if (userExists) {
        throw new BadRequestError(
          "User with this email or username already exists"
        );
      }

      // Create user with employee account type
      const password_hash = await bcrypt.hash(password, 8);

      const user = await UserRepository.create({
        ...req.body,
        acc_type: "employee",
        password_hash,
      });

      // Create employee association
      const employee = await EmployeeRepository.create({
        user_id: user.user_id,
        company_id: companyId,
        role,
      });

      // Return user and employee data
      user.password_hash = undefined;

      return res.success("Employee added successfully", { user, employee });
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
        throw new NotFoundError("Company not found");
      }

      // If not admin or not from this company, check if approved
      if (req.userId !== parseInt(companyId) && !req.adminEmployee) {
        const employeeCheck = await EmployeeRepository.findByUserAndCompany(
          req.userId,
          companyId
        );

        if (!employeeCheck) {
          throw new ForbiddenError(
            "You do not have permission to view employees for this company"
          );
        }
      }

      // Use new repository method
      const { count, rows } =
        await EmployeeRepository.findCompanyEmployeesPaginated(
          companyId,
          page,
          limit
        );

      const pagination = createPagination(page, limit, count);

      return res.success("Employees retrieved successfully", rows, pagination);
    } catch (error) {
      next(error);
    }
  },

  deleteEmployee: async (req, res, next) => {
    try {
      const { companyId, employeeId } = req.params;

      // Check if the authenticated user belongs to this company
      if (parseInt(companyId) !== req.company.company_id) {
        throw new ForbiddenError(
          "You do not have permission to delete employees from this company"
        );
      }

      const employee = await EmployeeRepository.findByUserAndCompany(
        employeeId,
        companyId
      );

      if (!employee) {
        throw new NotFoundError("Employee not found");
      }

      // Don't allow deleting super-admin if there's only one - use repository method
      if (employee.role === "super-admin") {
        const adminCount = await EmployeeRepository.countCompanyAdmins(
          companyId
        );

        if (adminCount <= 1) {
          throw new BadRequestError(
            "Cannot delete the only super-admin. Assign another super-admin first."
          );
        }
      }

      // Delete the employee association
      await EmployeeRepository.delete(employee.id);

      return res.success("Employee removed successfully");
    } catch (error) {
      next(error);
    }
  },

  updateEmployee: async (req, res, next) => {
    try {
      const { companyId, employeeId } = req.params;

      const employee = await EmployeeRepository.findByUserAndCompany(employeeId, companyId);

      if (!employee) {
        throw new NotFoundError('Employee not found');
      }

      // Add authorization check: Only the company owner (super-admin) should update employees
      // or an admin should be able to update other non-super-admin employees.
      // Assuming req.company.company_id is the authenticated user's company
      // and req.employee.role gives the role of the authenticated employee.

      if (req.company.company_id !== parseInt(companyId)) {
        throw new ForbiddenError("You do not have permission to update employees in this company.");
      }

      // If the authenticated user is an admin, they can update any employee within their company,
      // but a regular employee cannot update another employee.
      // A super-admin can update anyone, but if they are trying to change another super-admin's role
      // make sure there's at least one super-admin left if they are changing it from super-admin.

      const authenticatedEmployee = await EmployeeRepository.findByUserId(req.user.user_id);

      if (!authenticatedEmployee || authenticatedEmployee.company_id !== parseInt(companyId)) {
        throw new ForbiddenError("You do not have permission to perform this action.");
      }

      // Prevent non-super-admin from changing roles to super-admin or from changing another super-admin's role
      if (req.body.role === 'super-admin' && authenticatedEmployee.role !== 'super-admin') {
        throw new ForbiddenError("Only a super-admin can assign the 'super-admin' role.");
      }

      if (employee.role === 'super-admin' && authenticatedEmployee.role !== 'super-admin' && employeeId !== req.user.user_id) {
          throw new ForbiddenError("Only a super-admin can update another super-admin's details.");
      }


      await EmployeeRepository.update(employee.employee_id, req.body); // Use employee.employee_id for update

      const updatedEmployee = await EmployeeRepository.findByUserAndCompany(employeeId, companyId);

      return res.success('Employee updated successfully', updatedEmployee);

    }catch(error){
      next(error);
    }
  }
};

module.exports = employeeController;