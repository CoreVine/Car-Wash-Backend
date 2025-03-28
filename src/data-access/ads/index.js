const AdModel = require('../../models/Ad');
const BaseRepository = require('../base.repository');
const { DatabaseError, Op } = require("sequelize");

class AdRepository extends BaseRepository {
    constructor() {
        super(AdModel);
    }

    async findByName(name, options = {}) {
        try {
            return await this.model.findOne({
                where: { name },
                ...options
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    // Method for finding all ads
    async findAllAds(options = {}) {
        try {
            return await this.model.findAll(options);
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    // Method for paginated ads
    async findAdsPaginated(page = 1, limit = 10) {
        try {
            const options = {
                order: [['created_at', 'DESC']]
            };
            
            return await this.findAllPaginated(page, limit, options);
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    // Method to check if name is unique
    async isNameUnique(name, excludeId = null) {
        try {
            const where = { name };
            
            if (excludeId) {
                where.ad_id = {
                    [Op.ne]: excludeId
                };
            }
            
            const count = await this.model.count({ where });
            return count === 0;
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
}

module.exports = new AdRepository();
