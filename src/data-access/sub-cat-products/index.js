const SubCatProductModel = require('../../models/SubCatProduct');
const BaseRepository = require('../base.repository');
const { DatabaseError } = require("sequelize");

class SubCatProductRepository extends BaseRepository {
    constructor() {
        super(SubCatProductModel);
    }

    async findByProductId(productId, options = {}) {
        try {
            return await this.model.findAll({
                where: { product_id: productId },
                ...options
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    async findBySubCategoryId(subCategoryId, options = {}) {
        try {
            return await this.model.findAll({
                where: { sub_category_id: subCategoryId },
                include: [
                    {
                        model: this.model.sequelize.model('Product'),
                        as: 'product',
                        include: [
                            {
                                model: this.model.sequelize.model('ProductImage'),
                                as: 'images', // Changed from 'productImages' to match Product model association
                                limit: options.singleProduct ? null : 1 // If single product, include all images, else just one
                            }
                        ]
                    }
                ],
                ...options
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async findByCategoryId(categoryId, options = {}) {
        try {
            // First get all subcategories for this category
            const subCategories = await this.model.sequelize.model('SubCategory').findAll({
                where: { category_id: categoryId },
                include: [{
                    association: 'subCatProducts',
                    include: [{
                        model: this.model.sequelize.model('Product'),
                        as: 'product',
                        include: [
                            {
                                model: this.model.sequelize.model('ProductImage'),
                                as: 'images', // Changed from 'productImages' to match Product model association
                                limit: options.singleProduct ? null : 1 // If single product, include all images, else just one
                            }
                        ]
                    }]
                }]
            });
            
            // Extract and flatten the product associations
            const subCatProducts = subCategories.flatMap(subCat => 
                subCat.subCatProducts || []
            );
            
            return subCatProducts;
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async deleteByProductId(productId) {
        try {
            return await this.model.destroy({
                where: { product_id: productId }
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    // New methods for common operations
    async createSubCategoryProductAssociations(productId, subCategoryIds) {
        try {
            const subCatProducts = subCategoryIds.map(subCategoryId => ({
                product_id: productId,
                sub_category_id: subCategoryId
            }));
            
            return await this.bulkCreate(subCatProducts);
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async updateSubCategoryAssociations(productId, subCategoryIds) {
        try {
            // First delete existing associations
            await this.deleteByProductId(productId);
            
            // Then create new associations
            return await this.createSubCategoryProductAssociations(productId, subCategoryIds);
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
}

module.exports = new SubCatProductRepository();
