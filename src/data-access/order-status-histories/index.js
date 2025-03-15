import OrderStatusHistoryModel from '../../models/OrderStatusHistory';
import BaseRepository from '../base.repository';
import {DatabaseError} from "sequelize";

class OrderStatusHistoryRepository extends BaseRepository {
    constructor() {
        super(OrderStatusHistoryModel);
    }

    async findByOrderId(orderId, options = {}) {
        try {
            return await this.model.findAll({
                where: { order_id: orderId },
                order: [['timestamp', 'DESC']],
                ...options
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    async findLatestByOrderId(orderId) {
        try {
            return await this.model.findOne({
                where: { order_id: orderId },
                order: [['timestamp', 'DESC']]
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    // New methods for common operations
    async addOrderStatusHistory(orderId, status, notes = null) {
        try {
            return await this.create({
                order_id: orderId,
                status,
                notes,
                timestamp: new Date()
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async findOrderStatusHistoryPaginated(orderId, page = 1, limit = 10) {
        try {
            const options = {
                where: { order_id: orderId },
                order: [['timestamp', 'DESC']]
            };
            
            return await this.findAllPaginated(page, limit, options);
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
}

module.exports = new OrderStatusHistoryRepository();
