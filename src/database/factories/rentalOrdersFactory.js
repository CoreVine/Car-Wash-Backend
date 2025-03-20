const { faker } = require('@faker-js/faker');
const RentalOrders = require('../../models/RentalOrder');
const ordersFactory = require('./ordersFactory');
const carsFactory = require('./carsFactory');

const rentalOrdersFactory = {
  async create(count = 1, attrs = {}) {
    const rentalOrders = [];
    
    // Create order if not provided
    if (!attrs.order_id) {
      const orders = await ordersFactory.create(1, { order_type: 'rental' });
      attrs.order_id = orders[0].order_id;
    }
    
    // Create car if not provided
    if (!attrs.car_id) {
      const cars = await carsFactory.create(1);
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
