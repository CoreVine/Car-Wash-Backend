const WashOrderWashTypeModel = require('../../models/WashOrderWashType');
const BaseRepository = require('../base.repository');
const { DatabaseError } = require("sequelize");

class WashOrderWashTypeRepository extends BaseRepository {
    constructor() {
        super(WashOrderWashTypeModel);
    }

    async findByWashOrderId(washOrderId, options = {}) {
        try {
            return await this.model.findAll({
                where: { carwashorders_order_id: washOrderId },
                ...options
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async findByWashTypeId(washTypeId, options = {}) {
        try {
            return await this.model.findAll({
                where: { WashTypes_type_id: washTypeId },
                ...options
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    // Method to create many associations at once
    async createWashOrderTypeAssociations(washOrderId, washTypeData) {
        try {
            const records = washTypeData.map(item => ({
                carwashorders_order_id: washOrderId,
                WashTypes_type_id: item.typeId,
                paid_price: item.price
            }));
            
            return await this.bulkCreate(records);
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    // Method to get detailed wash order types
    async findWashOrderTypesWithDetails(washOrderId) {
        try {
            return await this.model.findAll({
                where: { carwashorders_order_id: washOrderId },
                include: [{
                    model: this.model.sequelize.model('WashType'),
                    as: 'washType'
                }]
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    // Calculate total price for a wash order
    async calculateWashOrderTotal(washOrderId) {
        try {
            const items = await this.findByWashOrderId(washOrderId);
            return items.reduce((total, item) => total + parseInt(item.paid_price || 0), 0);
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    // Method to delete all wash types for a wash order
    async deleteByWashOrderId(washOrderId) {
        try {
            return await this.model.destroy({
                where: { carwashorders_order_id: washOrderId }
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    // Method to update wash order types
    async updateWashOrderTypes(washOrderId, washTypeData) {
        try {
            // Delete existing associations
            await this.deleteByWashOrderId(washOrderId);
            
            // Create new associations
            return await this.createWashOrderTypeAssociations(washOrderId, washTypeData);
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    // Method to get detailed wash types with price for display
    async getWashTypesWithDetails(washOrderId) {
        try {
            return await this.model.findAll({
                where: { carwashorders_order_id: washOrderId },
                include: [{
                    model: this.model.sequelize.models.WashType,
                    as: 'washType',
                    attributes: ['name', 'description']
                }],
                attributes: ['paid_price']
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
}

module.exports = new WashOrderWashTypeRepository();
