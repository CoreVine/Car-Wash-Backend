const SubCategoryModel = require('../../models/SubCategory');
const BaseRepository = require('../base.repository');
const { DatabaseError } = require("sequelize");

class SubCategoryRepository extends BaseRepository {
    constructor() {
        super(SubCategoryModel);
    }

    async findByCategoryId(categoryId, options = {}) {
        try {
            return await this.model.findAll({
                where: { category_id: categoryId },
                ...options
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async findWithProducts(subCategoryId) {
        try {
            return await this.model.findByPk(subCategoryId, {
                include: ['products']
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    // New methods for common queries
    async findByCategoryIdPaginated(categoryId, page = 1, limit = 10) {
        try {
            const options = {
                where: { category_id: categoryId },
                order: [['sub_category_id', 'ASC']]
            };
            
            return await this.findAllPaginated(page, limit, options);
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async findWithProductsDetailed(subCategoryId) {
        try {
            return await this.model.findByPk(subCategoryId, {
                include: [
                    {
                        association: 'products',
                        include: ['images']
                    },
                    {
                        association: 'category'
                    },
                    {
                        association: 'subCatProducts'
                    }
                ]
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
}

module.exports = new SubCategoryRepository();
