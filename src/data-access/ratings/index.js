const RatingModel = require('../../models/Rating');
const BaseRepository = require('../base.repository');
const { DatabaseError } = require("sequelize");

class RatingRepository extends BaseRepository {
    constructor() {
        super(RatingModel);
    }

    async findByCompanyId(companyId, options = {}) {
        try {
            return await this.model.findAll({
                where: { company_id: companyId },
                ...options
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    async findByUserId(userId, options = {}) {
        try {
            return await this.model.findAll({
                where: { user_id: userId },
                ...options
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
    
    async getAverageRatingByCompany(companyId) {
        try {
            const result = await this.model.findOne({
                attributes: [
                    [this.model.sequelize.fn('AVG', this.model.sequelize.col('rating_value')), 'averageRating']
                ],
                where: { company_id: companyId }
            });
            
            return result.getDataValue('averageRating') || 0;
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    // New methods
    async findCompanyRatingsPaginated(companyId, page = 1, limit = 10, includeUser = true) {
        try {
            const options = {
                where: { company_id: companyId },
                order: [['created_at', 'DESC']]
            };
            
            if (includeUser) {
                options.include = [
                    {
                        model: this.model.sequelize.model('User'),
                        as: 'user',
                        attributes: ['user_id', 'name', 'username']
                    }
                ];
            }
            
            return await this.findAllPaginated(page, limit, options);
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async findUserRatingsPaginated(userId, page = 1, limit = 10, includeCompany = true) {
        try {
            const options = {
                where: { user_id: userId },
                order: [['created_at', 'DESC']]
            };
            
            if (includeCompany) {
                options.include = [
                    {
                        model: this.model.sequelize.model('Company'),
                        as: 'company',
                        attributes: ['company_id', 'company_name', 'logo_url']
                    }
                ];
            }
            
            return await this.findAllPaginated(page, limit, options);
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
}

module.exports = new RatingRepository();
