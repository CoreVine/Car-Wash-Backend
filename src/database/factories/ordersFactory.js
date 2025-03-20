const { faker } = require('@faker-js/faker');
const Orders = require('../../models/Order');
const userFactory = require('./userFactory');
const companyFactory = require('./companyFactory');
const paymentMethodFactory = require('./paymentMethodFactory');

const ordersFactory = {
  async create(count = 1, attrs = {}) {
    const orders = [];
    
    // Create user if not provided
    if (!attrs.user_id) {
      const users = await userFactory.create(1);
      attrs.user_id = users[0].user_id;
    }
    
    // Create company if not provided
    if (!attrs.company_id) {
      const companies = await companyFactory.create(1);
      attrs.company_id = companies[0].company_id;
    }
    
    // Create payment method if not provided
    if (!attrs.payment_method_id) {
      const paymentMethods = await paymentMethodFactory.create(1);
      attrs.payment_method_id = paymentMethods[0].payment_id;
    }
    
    for (let i = 0; i < count; i++) {
      const orderData = this.makeOne(attrs);
      orders.push(await Orders.create(orderData));
    }
    
    return orders;
  },
  
  makeOne(attrs = {}) {
    const orderTypes = ['product', 'wash', 'rental'];
    
    const defaultAttrs = {
      order_type: attrs.order_type || faker.helpers.arrayElement(orderTypes),
      order_date: faker.date.recent(),
      total_amount: parseFloat(faker.commerce.price({ min: 20, max: 1000 })),
      payment_gateway_response: JSON.stringify({
        transaction_id: faker.string.uuid(),
        status: 'completed',
        timestamp: faker.date.recent().toISOString()
      }),
      shipping_address: faker.location.streetAddress(true),
      created_at: new Date(),
      updated_at: new Date()
    };
    
    return { ...defaultAttrs, ...attrs };
  },
  
  make(count = 1, attrs = {}) {
    const orders = [];
    
    for (let i = 0; i < count; i++) {
      orders.push(this.makeOne(attrs));
    }
    
    return orders;
  }
};

module.exports = ordersFactory;
