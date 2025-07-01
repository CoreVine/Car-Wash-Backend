const CompanyRepository = require("../data-access/companies");
const UserRepository = require("../data-access/users");
const EmployeeRepository = require("../data-access/employees");
const { ForbiddenError } = require("../utils/errors/types/Api.error");

const isCompanyMiddleware = async (req, res, next) => {
  try {
    const user = await UserRepository.findById(req.userId);
    if (!user) {
      throw new ForbiddenError("Access denied. User privileges required");
    }

    const employee = await EmployeeRepository.findOne({
      where: {
        user_id: user.user_id,
      },
    });
    if (!employee) {
      throw new ForbiddenError("Access denied. Employee privileges required");
    }
    const company = await CompanyRepository.findById(employee.company_id);
    if (!company) {
      throw new ForbiddenError("Access denied. Company privileges required");
    }

    // Add company info to request for later use
    req.company = company;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isCompanyMiddleware;
