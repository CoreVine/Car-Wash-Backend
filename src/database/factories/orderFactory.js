const { faker } = require('@faker-js/faker');
const Order = require('../../models/Order');
const cartFactory = require('./cartFactory');
const paymentMethodFactory = require('./paymentMethodFactory');

const orderFactory = {
  async create(count = 1, attrs = {}) {
    const orders = [];
    
    // Create cart if not provided
    if (!attrs.cart_order_id) {
      // Create a cart with pending status
      const carts = await cartFactory.create(1, { status: 'pending' });
      attrs.cart_order_id = carts[0].order_id;
    }
    
    // Create payment method if not provided
    if (!attrs.payment_method_id) {
      const paymentMethods = await paymentMethodFactory.create(1);
      attrs.payment_method_id = paymentMethods[0].payment_id;
    }
    
    for (let i = 0; i < count; i++) {
      const orderData = this.makeOne(attrs);
      orders.push(await Order.create(orderData));
    }
    
    return orders;
  },
  
  makeOne(attrs = {}) {
    const defaultAttrs = {
      payment_gateway_response: JSON.stringify({
        transaction_id: faker.string.uuid(),
        status: 'completed',
        timestamp: faker.date.recent().toISOString()
      }),
      shipping_address: faker.location.streetAddress(true)
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

module.exports = orderFactory;
