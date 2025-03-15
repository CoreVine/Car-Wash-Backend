import CompanyModel from '../../models/Company';
import BaseRepository from '../base.repository';
import {DatabaseError, Op} from "sequelize";

class CompanyRepository extends BaseRepository {
    constructor() {
        super(CompanyModel);
    }

    async findByEmail(email) {
        try {
            return await this.model.findOne({
                where: { email }
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    async findWithRatings(companyId) {
        try {
            return await this.model.findByPk(companyId, {
                include: ['ratings']
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async findWithEmployees(companyId) {
        try {
            return await this.model.findByPk(companyId, {
                include: [{
                    association: 'employees',
                    include: ['user']
                }]
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    // New methods for common operations
    async findCompaniesWithApprovalStatus(approved = null, page = 1, limit = 10) {
        try {
            const whereClause = {};
            if (approved !== null) {
                whereClause.approved = approved;
            }
            
            return await this.findWithPagination(
                whereClause,
                page,
                limit,
                [['created_at', 'DESC']],
                {
                    attributes: { exclude: ['password_hash'] }
                }
            );
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async findCompanyDetailsByEmailOrName(email, companyName) {
        try {
            return await this.model.findOne({
                where: {
                    [Op.or]: [
                        { email },
                        { company_name: companyName }
                    ]
                }
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async findCompanyWithAllDetails(companyId) {
        try {
            return await this.model.findByPk(companyId, {
                attributes: { exclude: ['password_hash'] },
                include: [
                    {
                        association: 'employees',
                        include: [{
                            association: 'user',
                            attributes: { exclude: ['password_hash'] }
                        }]
                    },
                    {
                        association: 'ratings',
                        include: ['user']
                    },
                    {
                        association: 'products',
                        separate: true,
                        limit: 5
                    },
                    {
                        association: 'exhibitions',
                        separate: true,
                        limit: 5
                    }
                ]
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async approveCompany(companyId) {
        try {
            return await this.update(companyId, { approved: true });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
}

module.exports = new CompanyRepository();
