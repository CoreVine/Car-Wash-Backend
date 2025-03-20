const CompanyRepository = require('../data-access/companies');
const { ForbiddenError } = require('../utils/errors/types/Api.error');

const isCompanyMiddleware = async (req, res, next) => {
  try {
    const company = await CompanyRepository.findById(req.userId);
    
    if (!company) {
      throw new ForbiddenError('Access denied. Company privileges required');
    }
    
    // Add company info to request for later use
    req.company = company;
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isCompanyMiddleware;

