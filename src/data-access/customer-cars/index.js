const CustomerCarModel = require('../../models/CustomerCar');
const BaseRepository = require('../base.repository');
const { DatabaseError } = require("sequelize");

class CustomerCarRepository extends BaseRepository {
    constructor() {
        super(CustomerCarModel);
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

    async findByPlateNumber(plateNumber) {
        try {
            return await this.model.findOne({
                where: { car_plate_number: plateNumber }
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    // New methods for common operations
    async findCustomerCarsPaginated(customerId, page = 1, limit = 10) {
        try {
            const options = {
                where: { customer_id: customerId },
                order: [['customer_car_id', 'ASC']]
            };
            
            return await this.findAllPaginated(page, limit, options);
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async findCarWithWashHistory(carId) {
        try {
            return await this.model.findByPk(carId, {
                include: [{
                    association: 'washOrders',
                    include: ['operation']
                }]
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async hasActiveWashOrders(carId) {
        try {
            const count = await this.model.count({
                where: { customer_car_id: carId },
                include: [{
                    association: 'washOrders',
                    required: true,
                    include: [{
                        association: 'order',
                        required: true,
                        where: { status: 'pending' }
                    }]
                }]
            });
            
            return count > 0;
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
}

module.exports = new CustomerCarRepository();
