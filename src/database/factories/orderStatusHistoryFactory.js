const { faker } = require('@faker-js/faker');
const OrderStatusHistory = require('../../models/OrderStatusHistory');
const orderFactory = require('./orderFactory');

const orderStatusHistoryFactory = {
  async create(count = 1, attrs = {}) {
    const statusHistories = [];
    
    // Create order if not provided
    if (!attrs.order_id) {
      const orders = await orderFactory.create(1);
      attrs.order_id = orders[0].id; // Use id from the new Order model
    }
        
    for (let i = 0; i < count; i++) {
      const statusHistoryData = this.makeOne(attrs);
      statusHistories.push(await OrderStatusHistory.create(statusHistoryData));
    }
    
    return statusHistories;
  },
  
  makeOne(attrs = {}) {
    const defaultAttrs = {
      status: faker.helpers.arrayElement(['pending', 'complete']),
      timestamp: faker.date.recent()
    };
    
    return { ...defaultAttrs, order_id: attrs.order_id };
  },
  
  make(count = 1, attrs = {}) {
    const statusHistories = [];
    
    for (let i = 0; i < count; i++) {
      statusHistories.push(this.makeOne(attrs));
    }
    
    return statusHistories;
  }
};

module.exports = orderStatusHistoryFactory;
