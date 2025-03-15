import SubCatProductModel from '../../models/SubCatProduct';
import BaseRepository from '../base.repository';
import {DatabaseError} from "sequelize";

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
                ...options
            });
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
