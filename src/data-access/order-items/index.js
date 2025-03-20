const OrderItemModel = require('../../models/OrderItem');
const BaseRepository = require('../base.repository');
const { DatabaseError } = require("sequelize");

class OrderItemRepository extends BaseRepository {
    constructor() {
        super(OrderItemModel);
    }

    async findByOrderId(orderId, options = {}) {
        try {
            return await this.model.findAll({
                where: { order_id: orderId },
                include: ['product'],
                ...options
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    // New methods for common operations
    async createOrderItems(orderItems) {
        try {
            return await this.bulkCreate(orderItems);
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async findOrderItemsWithDetails(orderId) {
        try {
            return await this.model.findAll({
                where: { order_id: orderId },
                include: [{
                    association: 'product',
                    include: ['images']
                }],
                order: [['order_item_id', 'ASC']]
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async calculateOrderTotal(orderId) {
        try {
            const items = await this.findByOrderId(orderId);
            return items.reduce((total, item) => total + parseFloat(item.total_price || 0), 0);
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
}

module.exports = new OrderItemRepository();
