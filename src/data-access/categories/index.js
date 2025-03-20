const CategoryModel = require('../../models/Category');
const BaseRepository = require('../base.repository');
const { DatabaseError } = require("sequelize");

class CategoryRepository extends BaseRepository {
    constructor() {
        super(CategoryModel);
    }

    async findWithSubCategories(categoryId) {
        try {
            return await this.model.findByPk(categoryId, {
                include: ['subCategories']
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    async findAllWithSubCategories() {
        try {
            return await this.model.findAll({
                include: ['subCategories']
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    // New methods for common operations
    async findByName(categoryName) {
        try {
            return await this.model.findOne({
                where: { category_name: categoryName }
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async findCategoryWithProducts(categoryId) {
        try {
            return await this.model.findByPk(categoryId, {
                include: [{
                    association: 'subCategories',
                    include: [{
                        association: 'products',
                        include: ['images']
                    }]
                }]
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async findCategoriesPaginated(page = 1, limit = 10) {
        try {
            const options = {
                include: ['subCategories'],
                order: [['category_id', 'ASC']]
            };
            
            return await this.findAllPaginated(page, limit, options);
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
}

module.exports = new CategoryRepository();
