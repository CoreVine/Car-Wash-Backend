const OrderModel = require('../../models/Order');
const BaseRepository = require('../base.repository');
const { DatabaseError } = require("sequelize");

class OrderRepository extends BaseRepository {
    constructor() {
        super(OrderModel);
    }

    async findByUserId(userId, options = {}) {
        try {
            return await this.model.findAll({
                where: { user_id: userId },
                ...options
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    async findByCompanyId(companyId, options = {}) {
        try {
            return await this.model.findAll({
                where: { company_id: companyId },
                ...options
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    async findWithDetails(orderId) {
        try {
            return await this.model.findByPk(orderId, {
                include: [
                    { association: 'orderItems', include: ['product'] },
                    { association: 'carWashOrder', include: ['customerCar', 'operation'] },
                    { association: 'rentalOrder', include: ['car'] },
                    { association: 'statusHistory' },
                    { association: 'paymentMethod' }
                ]
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    // New methods
    async findUserOrdersPaginated(userId, page = 1, limit = 10) {
        try {
            const options = {
                where: { user_id: userId },
                include: [
                    {
                        association: 'orderItems',
                        include: ['product']
                    },
                    {
                        association: 'carWashOrder',
                        include: ['customerCar', 'operation']
                    },
                    {
                        association: 'rentalOrder',
                        include: [
                            { 
                                association: 'car',
                                include: ['images']
                            }
                        ]
                    }
                ],
                order: [['created_at', 'DESC']]
            };
            
            return await this.findAllPaginated(page, limit, options);
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async findCompanyOrdersPaginated(companyId, page = 1, limit = 10) {
        try {
            const options = {
                where: { company_id: companyId },
                include: [
                    { association: 'orderItems', include: ['product'] },
                    { association: 'statusHistory' },
                    { association: 'user', attributes: ['user_id', 'name', 'email', 'phone_number'] }
                ],
                order: [['created_at', 'DESC']]
            };
            
            return await this.findAllPaginated(page, limit, options);
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
}

module.exports = new OrderRepository();
