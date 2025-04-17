const CarOrder = require('../../models/CarOrder');
const BaseRepository = require('../base.repository');

class CarWashOrderRepository extends BaseRepository {
  constructor() {
      super(CarOrder);
  }
  async create(data) {
    return await this.model.create({
      car_id: data.car_id,
      orders_order_id: data.order_id
    });
  };

  async findById(id) {
    return await this.model.findByPk(id, {
      include: ['car']
    });
  };

  async findByOrderId(orderId) {
    return await this.model.findOne({
      where: {
        orders_order_id: orderId
      },
      include: ['car']
    });
  }

  async delete(id) {
    return await this.model.destroy({
      where: {
        car_order_id: id
      }
    });
  };

  async deleteByOrderId(orderId) {
    return await this.model.destroy({
      where: {
        orders_order_id: orderId
      }
    });
  }

  async addCarToCart(cartId, carId) {
    try {
      const t = await this.model.sequelize.transaction();
      
      try {
        // Check car existence
        const Car = this.model.sequelize.model('Car');
        const car = await Car.findByPk(carId, { transaction: t });
        
        if (!car) {
          throw new Error('Car not found');
        }
        
        if (car.sale_or_rental !== 'sale') {
          throw new Error('This car is not available for sale');
        }
        
        // Create car order
        const carOrder = await this.model.create({
          car_id: carId,
          orders_order_id: cartId
        }, { transaction: t });
        
        await t.commit();
        
        return carOrder;
      } catch (error) {
        await t.rollback();
        throw error;
      }
    } catch (error) {
      throw new Error(`Failed to add car to cart: ${error.message}`);
    }
  }
};

module.exports = new CarWashOrderRepository();
