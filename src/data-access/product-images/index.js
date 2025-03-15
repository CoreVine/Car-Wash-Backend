import ProductImageModel from '../../models/ProductImage';
import BaseRepository from '../base.repository';
import {DatabaseError} from "sequelize";

class ProductImageRepository extends BaseRepository {
    constructor() {
        super(ProductImageModel);
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
    
    async findByIds(imageIds, options = {}) {
        try {
            return await this.model.findAll({
                where: { image_id: imageIds },
                ...options
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    // New methods for common operations
    async findImageWithProductDetails(imageId) {
        try {
            return await this.model.findByPk(imageId, {
                include: [{
                    association: 'product',
                    include: ['company']
                }]
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async deleteAllProductImages(productId) {
        try {
            return await this.model.destroy({
                where: { product_id: productId }
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
}

module.exports = new ProductImageRepository();
