const { faker } = require('@faker-js/faker');
const RentalOrders = require('../../models/RentalOrder');
const cartFactory = require('./cartFactory');
const carsFactory = require('./carsFactory');

const rentalOrdersFactory = {
  async create(count = 1, attrs = {}) {
    const rentalOrders = [];
    
    // Create cart if not provided
    if (!attrs.order_id) {
      const carts = await cartFactory.create(1, { status: 'pending' });
      attrs.order_id = carts[0].order_id;
    }
    
    // Create car if not provided, make sure it's a rental car
    if (!attrs.car_id) {
      const cars = await carsFactory.create(1, { sale_or_rental: 'rent' });
      attrs.car_id = cars[0].car_id;
    }
    
    for (let i = 0; i < count; i++) {
      const rentalOrderData = this.makeOne(attrs);
      rentalOrders.push(await RentalOrders.create(rentalOrderData));
    }
    
    return rentalOrders;
  },
  
  makeOne(attrs = {}) {
    const startDate = faker.date.future();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + faker.number.int({ min: 1, max: 14 }));
    
    const defaultAttrs = {
      start_date: startDate,
      end_date: endDate
    };
    
    return { ...defaultAttrs, ...attrs };
  },
  
  make(count = 1, attrs = {}) {
    const rentalOrders = [];
    
    for (let i = 0; i < count; i++) {
      rentalOrders.push(this.makeOne(attrs));
    }
    
    return rentalOrders;
  }
};

module.exports = rentalOrdersFactory;
