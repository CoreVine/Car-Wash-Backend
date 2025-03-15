import CarWashOrderModel from '../../models/CarWashOrder';
import BaseRepository from '../base.repository';
import {DatabaseError} from "sequelize";

class CarWashOrderRepository extends BaseRepository {
    constructor() {
        super(CarWashOrderModel);
    }

    async findByCustomerId(customerId, options = {}) {
        try {
            return await this.model.findAll({
                where: { customer_id: customerId },
                ...options
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    async findByOrderId(orderId) {
        try {
            return await this.model.findOne({
                where: { order_id: orderId },
                include: ['customerCar', 'operation', 'customer']
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    // New methods for common operations
    async findCustomerWashOrdersPaginated(customerId, page = 1, limit = 10) {
        try {
            const options = {
                where: { customer_id: customerId },
                include: [
                    { 
                        association: 'customerCar'
                    },
                    { 
                        association: 'operation',
                        include: ['assignedEmployee']
                    },
                    {
                        association: 'order',
                        include: ['statusHistory']
                    }
                ],
                order: [['created_at', 'DESC']]
            };
            
            return await this.findAllPaginated(page, limit, options);
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async findCarWashOrderWithDetails(washOrderId) {
        try {
            return await this.model.findByPk(washOrderId, {
                include: [
                    {
                        association: 'customerCar'
                    },
                    {
                        association: 'operation',
                        include: [{
                            association: 'assignedEmployee',
                            include: ['user']
                        }]
                    },
                    {
                        association: 'order',
                        include: [
                            'statusHistory', 
                            'paymentMethod',
                            {
                                association: 'user',
                                attributes: ['user_id', 'name', 'email', 'phone_number']
                            }
                        ]
                    }
                ]
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
}

module.exports = new CarWashOrderRepository();
