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

    // Add car rental to cart with availability check in a transaction
    async addRentalToCart(cartId, carId, startDate, endDate) {
        try {
            const t = await this.model.sequelize.transaction();
            
            try {
                // Check car existence
                const Car = this.model.sequelize.model('Car');
                const car = await Car.findByPk(carId, { transaction: t });
                
                if (!car) {
                    throw new Error('Car not found');
                }
                
                if (car.sale_or_rental !== 'rent') {
                    throw new Error('This car is not available for rental');
                }
                
                // Check availability for the requested dates
                const start_date = new Date(startDate);
                const end_date = new Date(endDate);
                
                // Get all rental orders for this car
                const rentalOrders = await this.findByCarId(carId, { transaction: t });
                
                // Get all cart_ids from rental orders
                const orderIds = rentalOrders.map(rental => rental.order_id);
                
                if (orderIds.length > 0) {
                    // Get carts that are not cancelled
                    const Cart = this.model.sequelize.model('Cart');
                    const activeCarts = await Cart.findAll({
                        where: { 
                            order_id: { [Op.in]: orderIds },
                            status: { [Op.ne]: 'cancelled' }
                        },
                        transaction: t
                    });
                    
                    // Get active rental order IDs
                    const activeOrderIds = activeCarts.map(cart => cart.order_id);
                    
                    // Filter rental orders that are active
                    const activeRentals = rentalOrders.filter(rental => 
                        activeOrderIds.includes(rental.order_id)
                    );
                    
                    // Check for overlaps
                    const hasOverlap = activeRentals.some(rental => {
                        const rentalStart = new Date(rental.start_date);
                        const rentalEnd = new Date(rental.end_date);
                        
                        // Check for overlap
                        return (
                            (start_date >= rentalStart && start_date <= rentalEnd) ||
                            (end_date >= rentalStart && end_date <= rentalEnd) ||
                            (start_date <= rentalStart && end_date >= rentalEnd)
                        );
                    });
                    
                    if (hasOverlap) {
                        throw new Error('Car is not available for the requested dates');
                    }
                }
                
                // Create the rental order
                const rentalOrder = await this.create({
                    order_id: cartId,
                    car_id: carId,
                    start_date,
                    end_date
                }, { transaction: t });
                
                await t.commit();
                
                return rentalOrder;
            } catch (error) {
                await t.rollback();
                throw error;
            }
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
}

module.exports = new RentalOrderRepository();
