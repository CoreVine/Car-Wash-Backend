import EmployeeModel from '../../models/Employee';
import BaseRepository from '../base.repository';
import {DatabaseError} from "sequelize";

class EmployeeRepository extends BaseRepository {
    constructor() {
        super(EmployeeModel);
    }

    async findByCompanyId(companyId, options = {}) {
        try {
            return await this.model.findAll({
                where: { company_id: companyId },
                include: ['user'],
                ...options
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    async findByUserId(userId) {
        try {
            return await this.model.findOne({
                where: { user_id: userId },
                include: ['company', 'user']
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async findByUserAndCompany(userId, companyId) {
        try {
            return await this.model.findOne({
                where: { 
                    user_id: userId,
                    company_id: companyId
                }
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    // New methods for common operations
    async findCompanyEmployeesPaginated(companyId, page = 1, limit = 10) {
        try {
            const options = {
                where: { company_id: companyId },
                include: [{
                    association: 'user',
                    attributes: ['user_id', 'name', 'email', 'phone_number', 'profile_picture_url']
                }],
                order: [['created_at', 'DESC']]
            };
            
            return await this.findAllPaginated(page, limit, options);
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async findEmployeeWithFullDetails(employeeId) {
        try {
            return await this.model.findByPk(employeeId, {
                include: [
                    {
                        association: 'user',
                        attributes: { exclude: ['password_hash'] }
                    },
                    {
                        association: 'company',
                        attributes: ['company_id', 'company_name', 'logo_url']
                    }
                ]
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async countCompanyAdmins(companyId) {
        try {
            return await this.count({
                company_id: companyId,
                role: 'super-admin'
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
}

module.exports = new EmployeeRepository();
