const { faker } = require('@faker-js/faker');
const CarWashOrders = require('../../models/CarWashOrder');
const cartFactory = require('./cartFactory');
const userFactory = require('./userFactory');
const customerCarFactory = require('./customerCarFactory');

const carWashOrdersFactory = {
  async create(count = 1, attrs = {}) {
    const washOrders = [];
    
    // Create user if not provided
    if (!attrs.customer_id) {
      const users = await userFactory.create(1);
      attrs.customer_id = users[0].user_id;
    }
    
    // Create customer car if not provided
    // FUTURE FU-001
    // if (!attrs.customer_car_id) {
    //   const cars = await customerCarFactory.create(1, { customer_id: attrs.customer_id });
    //   attrs.customer_car_id = cars[0].customer_car_id;
    // }
    
    // Create cart if not provided
    if (!attrs.order_id) {
      const carts = await cartFactory.create(1, { 
        status: 'pending',
        user_id: attrs.customer_id
      });
      attrs.order_id = carts[0].order_id;
    }
    
    for (let i = 0; i < count; i++) {
      const washOrderData = this.makeOne(attrs);
      washOrders.push(await CarWashOrders.create(washOrderData));
    }
    
    return washOrders;
  },
  
  makeOne(attrs = {}) {
    const defaultAttrs = {
      within_company: faker.datatype.boolean() ? 1 : 0,
      location: faker.location.streetAddress(true)
    };
    
    return { ...defaultAttrs, ...attrs };
  },
  
  make(count = 1, attrs = {}) {
    const washOrders = [];
    
    for (let i = 0; i < count; i++) {
      washOrders.push(this.makeOne(attrs));
    }
    
    return washOrders;
  }
};

module.exports = carWashOrdersFactory;
