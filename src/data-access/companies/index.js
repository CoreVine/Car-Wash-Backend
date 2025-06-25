const CompanyModel = require("../../models/Company");
const BaseRepository = require("../base.repository");
const { DatabaseError, Op } = require("sequelize");

class CompanyRepository extends BaseRepository {
  constructor() {
    super(CompanyModel);
  }

  async findByEmail(email) {
    try {
      return await this.model.findOne({
        where: { 
          email,
          company_name: { [Op.ne]: 'main' } 
        },
      });
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async findWithRatings(companyId) {
    try {
      const company = await this.model.findByPk(companyId);
      if (company && company.company_name === 'main') {
        return null;
      }
      
      return await this.model.findByPk(companyId, {
        include: ["ratings"],
      });
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async findWithEmployees(companyId) {
    try {
      const company = await this.model.findByPk(companyId);
      if (company && company.company_name === 'main') {
        return null;
      }
      
      return await this.model.findByPk(companyId, {
        include: [
          {
            association: "employees",
            include: ["user"],
          },
        ],
      });
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async findCompaniesWithApprovalStatus(approved = null, page = 1, limit = 10) {
    try {
      const whereClause = {
        company_name: { [Op.ne]: 'main' }
      };
      
      if (approved !== null) {
        whereClause.approved = approved;
      }

      return await this.model.findAndCountAll({
        where: whereClause,
        attributes: {
          exclude: ["password_hash"],
          // total_rating is already included in the Company model
        },
        limit,
        offset: (page - 1) * limit,
        order: [["created_at", "DESC"]],
      });
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async findCompanyDetailsByEmailOrName(email, companyName) {
    try {
      return await this.model.findOne({
        where: {
          [Op.or]: [{ email }, { company_name: companyName }],
          company_name: { [Op.ne]: 'main' }
        },
      });
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async findCompanyWithAllDetails(companyId) {
    try {
      const company = await this.model.findByPk(companyId);
      if (company && company.company_name === 'main') {
        return null;
      }
      
      return await this.model.findByPk(companyId, {
        attributes: { exclude: ["password_hash"] },
        include: [
          {
            association: "employees",
            attributes: { exclude: ["password_hash"] },
          },
          {
            association: "ratings",
          },
          {
            association: "exhibitions",
            separate: true,
            limit: 5,
          },
        ],
      });
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async approveCompany(companyId) {
    try {
      const company = await this.model.findByPk(companyId);
      if (company && company.company_name === 'main') {
        return null;
      }
      
      return await this.update(companyId, { approved: true });
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async findCompanyBasicDetails(companyId) {
    try {
      const company = await this.model.findByPk(companyId);
      if (company && company.company_name === 'main') {
        return null;
      }
      
      return await this.model.findByPk(companyId, {
        attributes: {
          exclude: ["password_hash", "created_at", "updated_at", "approved"],
        },
      });
    } catch (error) {
      throw new DatabaseError(error);
    }
  }
}

module.exports = new CompanyRepository();
