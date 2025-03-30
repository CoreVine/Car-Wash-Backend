const Yup = require("yup");
const { Op } = require("sequelize");
// Import repositories
const CompanyRepository = require("../data-access/companies");
const CompanyDocumentRepository = require("../data-access/company-documents");
const WashTypeRepository = require("../data-access/wash-types"); // Add this import
const awsService = require("../services/aws.service");
const { createPagination } = require("../utils/responseHandler");
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError
} = require("../utils/errors/types/Api.error");

const companyController = {
  getAllCompanies: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const approved = req.query.approved === 'true' ? true : 
                      req.query.approved === 'false' ? false : null;
      
      // Use new repository method instead of passing options directly
      const { count, rows } = await CompanyRepository.findCompaniesWithApprovalStatus(approved, page, limit);

      const pagination = createPagination(page, limit, count);

      return res.success('Companies retrieved successfully', rows, pagination);
    } catch (error) {
      next(error);
    }
  },

  getCompany: async (req, res, next) => {
    try {
      const { companyId } = req.params;
      
      // Use new repository method that excludes password_hash
      const company = await CompanyRepository.findCompanyWithAllDetails(companyId);

      if (!company) {
        throw new NotFoundError('Company not found');
      }

      return res.success('Company retrieved successfully', company);
    } catch (error) {
      next(error);
    }
  },
  
  getCompanyWithWashTypes: async (req, res, next) => {
    try {
      const { companyId } = req.params;
      
      // Use the new repository method that only gets basic company details
      const company = await CompanyRepository.findCompanyBasicDetails(companyId);

      if (!company) {
        throw new NotFoundError('Company not found');
      }
      
      // Get wash types for this company
      const washTypes = await WashTypeRepository.findByCompanyId(companyId);
      
      // Combine the data
      const result = {
        ...company.toJSON(),
        wash_types: washTypes
      };

      return res.success('Company with wash types retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  },

  updateCompany: async (req, res, next) => {
    try {
      const { companyId } = req.params;
      
      // Only admin or the company itself can update company details
      if (req.userId !== parseInt(companyId) && !req.adminEmployee) {
        throw new ForbiddenError('You do not have permission to update this company');
      }

      const company = await CompanyRepository.findById(companyId);

      if (!company) {
        throw new NotFoundError('Company not found');
      }

      const { email, company_name, total_rating, ...otherData } = req.body;

      // Check if email or company name is being changed and already exists
      if ((email && email !== company.email) || (company_name && company_name !== company.company_name)) {
        const companyExists = await CompanyRepository.findOne({
          where: {
            [Op.or]: [
              { email: email || company.email },
              { company_name: company_name || company.company_name }
            ],
            company_id: { [Op.ne]: companyId }
          }
        });

        if (companyExists) {
          throw new BadRequestError('Email or company name already in use');
        }
      }

      // Prevent updating total_rating directly by excluding it from the update
      await CompanyRepository.update(companyId, { 
        email, 
        company_name, 
        ...otherData 
      });
      
      const updatedCompany = await CompanyRepository.findById(companyId, {
        attributes: { exclude: ['password_hash'] }
      });

      return res.success('Company updated successfully', updatedCompany);
    } catch (error) {
      next(error);
    }
  },

  approveCompany: async (req, res, next) => {
    try {
      const { companyId } = req.params;
      
      const company = await CompanyRepository.findById(companyId);

      if (!company) {
        throw new NotFoundError('Company not found');
      }

      // Use new repository method for approval
      await CompanyRepository.approveCompany(companyId);

      return res.success('Company approved successfully');
    } catch (error) {
      next(error);
    }
  },

  uploadDocument: async (req, res, next) => {
    try {
      const { companyId } = req.params;
      
      // Only admin or the company itself can upload documents
      if (req.userId !== parseInt(companyId) && !req.adminEmployee) {
        throw new ForbiddenError('You do not have permission to upload documents for this company');
      }
      
      if (!req.file) {
        throw new BadRequestError('No document uploaded');
      }

      const company = await CompanyRepository.findById(companyId);

      if (!company) {
        throw new NotFoundError('Company not found');
      }
      
      // Get file extension
      const fileExt = req.file.originalname.split('.').pop();
      
      // Upload file to AWS S3
      const uuid = await awsService.uploadFile(req.file, fileExt, 'company-documents/');
      
      // Create document record in database
      const document = await CompanyDocumentRepository.create({
        company_id: companyId,
        document_type: req.body.document_type,
        document_url: `${uuid}.${fileExt}`,
        upload_date: new Date()
      });

      return res.success('Document uploaded successfully', document);
    } catch (error) {
      next(error);
    }
  },

  getDocuments: async (req, res, next) => {
    try {
      const { companyId } = req.params;
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      
      // Only admin or the company itself can view documents
      if (req.userId !== parseInt(companyId) && !req.adminEmployee) {
        throw new ForbiddenError('You do not have permission to view documents for this company');
      }

      // Use new repository method for pagination
      const { count, rows } = await CompanyDocumentRepository.findCompanyDocumentsPaginated(companyId, page, limit);
      
      const pagination = createPagination(page, limit, count);

      return res.success('Documents retrieved successfully', rows, pagination);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = companyController;
