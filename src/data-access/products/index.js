const ProductModel = require('../../models/Product');
const BaseRepository = require('../base.repository');
const { DatabaseError, Op } = require("sequelize");

class ProductRepository extends BaseRepository {
    constructor() {
        super(ProductModel);
    }

    async findWithSubcategories(productId) {
        try {
            return await this.model.findByPk(productId, {
                include: [
                    {
                        association: 'subCategories',
                    },
                    {
                        association: 'images'
                    }
                ]
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async findProductsWithFilters({
        page = 1, 
        limit = 10,
        category_id = null, 
        sub_category_id = null,
        min_price = null,
        max_price = null,
        search = null
    }) {
        try {
            const whereClause = {};

            // Filter by price range
            if (min_price !== null || max_price !== null) {
                whereClause.price = {};
                if (min_price !== null) {
                    whereClause.price[Op.gte] = parseFloat(min_price);
                }
                if (max_price !== null) {
                    whereClause.price[Op.lte] = parseFloat(max_price);
                }
            }
            
            // Search by name or description
            if (search) {
                whereClause[Op.or] = [
                    { product_name: { [Op.like]: `%${search}%` } },
                    { description: { [Op.like]: `%${search}%` } }
                ];
            }
            
            // Build include options
            const includeOptions = [
                {
                    model: this.model.sequelize.model('ProductImage'),
                    as: 'images',
                    attributes: ['image_url']
                },
                {
                    model: this.model.sequelize.model('SubCategory'),
                    as: 'subCategories',
                    attributes: ['name', 'sub_category_id'],
                    through: { attributes: [] },
                    include: [{
                        model: this.model.sequelize.model('Category'),
                        as: 'category',
                        attributes: ['category_name', 'category_id']
                    }]
                }
            ];
            
            // Filter by category or subcategory
            if (category_id || sub_category_id) {
                if (sub_category_id) {
                    includeOptions[2].where = { sub_category_id };
                } else if (category_id) {
                    includeOptions[2].where = {};
                    includeOptions[2].include[0].where = { category_id };
                }
            }
            
            return await this.findWithPagination(
                whereClause,
                page,
                limit,
                [['created_at', 'DESC']],
                { include: includeOptions }
            );
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async findDetailedProduct(productId) {
        try {
            return await this.model.findByPk(productId, {
                include: [
                    {
                        model: this.model.sequelize.model('ProductImage'),
                        as: 'images',
                        attributes: ['image_url']
                    },
                    {
                        model: this.model.sequelize.model('SubCategory'),
                        as: 'subCategories',
                        attributes: ['name'],
                        include: [{
                            model: this.model.sequelize.model('Category'),
                            as: 'category',
                            attributes: ['category_name']
                        }]
                    }
                ]
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
}

module.exports = new ProductRepository();
