const WashTypeModel = require('../../models/WashType');
const BaseRepository = require('../base.repository');
const { DatabaseError, Op } = require("sequelize");

class WashTypeRepository extends BaseRepository {
    constructor() {
        super(WashTypeModel);
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
    
    // Method for finding wash types with price range
    async findByPriceRange(minPrice, maxPrice, options = {}) {
        try {
            const whereClause = {};
            
            if (minPrice !== null) {
                whereClause.price = { [Op.gte]: minPrice };
            }
            
            if (maxPrice !== null) {
                whereClause.price = { 
                    ...whereClause.price,
                    [Op.lte]: maxPrice 
                };
            }
            
            return await this.model.findAll({
                where: whereClause,
                ...options
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    // Method for finding by name contains
    async findByNameContains(name, options = {}) {
        try {
            return await this.model.findAll({
                where: {
                    name: {
                        [Op.like]: `%${name}%`
                    }
                },
                ...options
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    // Method for finding by company with pagination
    async findByCompanyPaginated(companyId, page = 1, limit = 10) {
        try {
            const options = {
                where: { company_id: companyId },
                order: [['price', 'ASC']]
            };
            
            return await this.findAllPaginated(page, limit, options);
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    // Method for finding wash types with orders for a customer
    async findWashTypesForCustomer(customerId, options = {}) {
        try {
            return await this.model.findAll({
                include: [{
                    association: 'washOrders',
                    required: true,
                    include: [{
                        association: 'customer',
                        required: true,
                        where: { user_id: customerId }
                    }]
                }],
                ...options
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    // Method for finding popular wash types
    async findPopularWashTypes(limit = 5) {
        try {
            return await this.model.findAll({
                include: [{
                    association: 'washOrders',
                    attributes: []
                }],
                attributes: {
                    include: [
                        [
                            this.model.sequelize.fn('COUNT', 
                            this.model.sequelize.col('washOrders.order_id')), 
                            'orderCount'
                        ]
                    ]
                },
                group: ['WashType.type_id'],
                order: [[this.model.sequelize.literal('orderCount'), 'DESC']],
                limit
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
}

module.exports = new WashTypeRepository();
