const RentalOrderModel = require('../../models/RentalOrder');
const BaseRepository = require('../base.repository');
const { DatabaseError, Op } = require("sequelize");

class RentalOrderRepository extends BaseRepository {
    constructor() {
        super(RentalOrderModel);
    }

    async findByOrderId(orderId) {
        try {
            return await this.model.findOne({
                where: { order_id: orderId },
                include: [{ 
                    association: 'car',
                    include: ['images'] 
                }]
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async findByCarId(carId, options = {}) {
        try {
            return await this.model.findAll({
                where: { car_id: carId },
                ...options
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async findBookingsInDateRange(carId, startDate, endDate) {
        try {
            return await this.model.findAll({
                where: {
                    car_id: carId,
                    [Op.or]: [
                        {
                            start_date: {
                                [Op.between]: [startDate, endDate]
                            }
                        },
                        {
                            end_date: {
                                [Op.between]: [startDate, endDate]
                            }
                        },
                        {
                            [Op.and]: [
                                {
                                    start_date: {
                                        [Op.lte]: startDate
                                    }
                                },
                                {
                                    end_date: {
                                        [Op.gte]: endDate
                                    }
                                }
                            ]
                        }
                    ]
                }
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    // New methods for common queries
    async findDetailedRentalOrder(rentalOrderId) {
        try {
            return await this.model.findByPk(rentalOrderId, {
                include: [
                    {
                        association: 'order',
                        include: ['user', 'statusHistory']
                    },
                    {
                        association: 'car',
                        include: ['images', 'company']
                    }
                ]
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async findCarRentalsPaginated(carId, page = 1, limit = 10) {
        try {
            const options = {
                where: { car_id: carId },
                include: ['order'],
                order: [['start_date', 'DESC']]
            };
            
            return await this.findAllPaginated(page, limit, options);
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
    
    async isCarAvailableForDates(carId, startDate, endDate) {
        try {
            const overlappingRentals = await this.count({
                car_id: carId,
                [Op.or]: [
                    {
                        [Op.and]: [
                            { start_date: { [Op.lte]: startDate } },
                            { end_date: { [Op.gte]: startDate } }
                        ]
                    },
                    {
                        [Op.and]: [
                            { start_date: { [Op.lte]: endDate } },
                            { end_date: { [Op.gte]: endDate } }
                        ]
                    },
                    {
                        [Op.and]: [
                            { start_date: { [Op.gte]: startDate } },
                            { end_date: { [Op.lte]: endDate } }
                        ]
                    }
                ]
            });
            
            return overlappingRentals === 0;
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
}

module.exports = new RentalOrderRepository();
